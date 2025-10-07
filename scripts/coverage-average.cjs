#!/usr/bin/env node
/* eslint-disable */
// Script para calcular média de cobertura. Se o arquivo summary não existir,
// executa automaticamente jest com cobertura.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const summaryPath = path.resolve(__dirname, '../coverage/coverage-summary.json');

function ensureCoverage() {
    if (fs.existsSync(summaryPath)) return;
    console.log('ℹ️ coverage-summary.json não encontrado. Gerando cobertura (jest --coverage)...');
    try {
        execSync('npx jest --coverage --runInBand', { stdio: 'inherit' });
    } catch (err) {
        console.error('❌ Falha ao executar testes para gerar cobertura.');
        process.exit(1);
    }
    if (!fs.existsSync(summaryPath)) {
        console.error('❌ Ainda sem coverage-summary.json após execução dos testes. Abortando.');
        process.exit(1);
    }
}

function computeAverage() {
    try {
        const raw = fs.readFileSync(summaryPath, 'utf8');
        const c = JSON.parse(raw);
        const metrics = ['lines', 'statements', 'functions', 'branches'];
        const values = metrics.map(m => c.total[m]?.pct || 0);
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
}

ensureCoverage();
computeAverage();
