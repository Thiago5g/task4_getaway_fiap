#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const summaryPath = path.resolve(__dirname, '../coverage/coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
    console.error('❌ coverage-summary.json não encontrado. Rode antes: npm run test:cov');
    process.exit(1);
}
try {
    const c = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const metrics = ['lines', 'statements', 'functions', 'branches'];
    const values = metrics.map(m => c.total[m].pct || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    console.log('--- Cobertura ---');
    metrics.forEach((m, i) => console.log(`${m}: ${values[i]}%`));
    console.log(`Média: ${avg.toFixed(2)}%`);
    if (avg < 80) {
        console.error('❌ Média abaixo de 80%');
        process.exit(1);
    } else {
        console.log('✅ Média >= 80%');
    }
} catch (e) {
    console.error('Erro ao processar coverage-summary.json:', e.message);
    process.exit(1);
}
