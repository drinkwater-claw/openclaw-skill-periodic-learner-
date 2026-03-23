#!/usr/bin/env node
/**
 * GitHub Trending 项目获取脚本
 * 
 * 使用方法:
 * node fetch-github-trending.js [language] [since]
 * 
 * 参数:
 * - language: 编程语言 (可选，默认：any)
 * - since: 时间范围 (可选，默认：daily)
 */

const https = require('https');

// 配置
const CONFIG = {
  github: {
    apiUrl: 'https://api.github.com',
    trendingUrl: 'https://github.com/trending',
    // 从环境变量或配置获取 token
    token: process.env.GITHUB_TOKEN || ''
  },
  minStars: 100,
  maxProjects: 10
};

// 获取 trending 项目
async function fetchTrending(language = 'any', since = 'daily') {
  const url = `${CONFIG.github.trendingUrl}${language !== 'any' ? `?language=${language}` : ''}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'fragmented-learning-skill',
        ...(CONFIG.github.token && { 'Authorization': `token ${CONFIG.github.token}` })
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const projects = parseTrendingPage(data);
          resolve(projects);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 解析 GitHub trending 页面
function parseTrendingPage(html) {
  const projects = [];
  const regex = /<article class="Box-row">([\s\S]*?)<\/article>/g;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    const row = match[1];
    
    // 提取项目名称
    const nameMatch = row.match(/href="\/([^"]+\/[^"]+)"/);
    // 提取描述
    const descMatch = row.match(/<p class="col-9 text-gray">([^<]*)<\/p>/);
    // 提取 stars
    const starsMatch = row.match(/svg[^>]*>[\s\n]*([\d,\.]+[kM]?)/);
    // 提取 forks
    const forksMatch = row.match(/svg[^>]*>[\s\n]*([\d,\.]+[kM]?)[\s\n]*\n[\s\n]*fork/);
    // 提取语言
    const langMatch = row.match(/span class="ml-1">([^<]+)<\/span>/);
    
    if (nameMatch) {
      projects.push({
        fullName: nameMatch[1],
        name: nameMatch[1].split('/')[1],
        owner: nameMatch[1].split('/')[0],
        url: `https://github.com/${nameMatch[1]}`,
        description: descMatch ? descMatch[1].trim() : '',
        stars: parseNumber(starsMatch ? starsMatch[1] : '0'),
        forks: parseNumber(forksMatch ? forksMatch[1] : '0'),
        language: langMatch ? langMatch[1].trim() : 'Unknown'
      });
    }
  }
  
  return projects.sort((a, b) => b.stars - a.stars);
}

// 解析数字 (处理 k, M 后缀)
function parseNumber(str) {
  if (!str) return 0;
  str = str.replace(/,/g, '').trim();
  
  if (str.endsWith('k')) {
    return Math.floor(parseFloat(str) * 1000);
  } else if (str.endsWith('M')) {
    return Math.floor(parseFloat(str) * 1000000);
  }
  
  return parseInt(str, 10);
}

// 加载学习历史
function loadHistory() {
  const fs = require('fs');
  const path = require('path');
  const historyPath = path.join(__dirname, '.history.json');
  
  try {
    if (fs.existsSync(historyPath)) {
      return JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading history:', e);
  }
  
  return { learnedProjects: [], lastUpdated: new Date().toISOString() };
}

// 保存学习历史
function saveHistory(history) {
  const fs = require('fs');
  const path = require('path');
  const historyPath = path.join(__dirname, '.history.json');
  
  history.lastUpdated = new Date().toISOString();
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// 过滤已学习项目
function filterLearned(projects, history) {
  const learned = new Set(history.learnedProjects.map(p => p.fullName));
  return projects.filter(p => !learned.has(p.fullName));
}

// 主函数
async function main() {
  const language = process.argv[2] || 'any';
  const since = process.argv[3] || 'daily';
  
  console.log(`Fetching GitHub trending projects...`);
  console.log(`Language: ${language}, Since: ${since}`);
  
  try {
    // 获取 trending 项目
    const allProjects = await fetchTrending(language, since);
    console.log(`Found ${allProjects.length} projects`);
    
    // 加载历史
    const history = loadHistory();
    
    // 过滤已学习
    const available = filterLearned(allProjects, history);
    console.log(`Available (not learned): ${available.length} projects`);
    
    // 选择最优项目
    if (available.length === 0) {
      console.log('No new projects available. All trending projects have been learned.');
      return;
    }
    
    const selected = available[0]; // 选择 stars 最高的
    console.log('\nSelected project:');
    console.log(`  Name: ${selected.fullName}`);
    console.log(`  Stars: ${selected.stars}`);
    console.log(`  Forks: ${selected.forks}`);
    console.log(`  Language: ${selected.language}`);
    console.log(`  URL: ${selected.url}`);
    console.log(`  Description: ${selected.description}`);
    
    // 输出为 JSON (供 Skill 使用)
    console.log('\n---JSON START---');
    console.log(JSON.stringify(selected, null, 2));
    console.log('---JSON END---');
    
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { fetchTrending, loadHistory, saveHistory, filterLearned };
