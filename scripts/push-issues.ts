import fs from 'fs';
import path from 'path';

async function pushIssues() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.argv[2];

  if (!token) {
    console.error("❌ ERROR: GitHub Personal Access Token (GITHUB_TOKEN) tidak ditemukan!");
    console.log("\n💡 CARA PENGGUNAAN:");
    console.log("1. Buat token di GitHub: https://github.com/settings/tokens (pilih scope 'repo')");
    console.log("2. Jalankan perintah:");
    console.log("   npx tsx scripts/push-issues.ts <GITHUB_TOKEN>");
    process.exit(1);
  }

  const issuesDir = path.join(process.cwd(), '.github', 'ISSUES');
  if (!fs.existsSync(issuesDir)) {
    console.error("❌ Folder .github/ISSUES/ tidak ditemukan!");
    process.exit(1);
  }

  const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.md'));
  console.log(`🚀 Ditemukan ${files.length} draf issue di .github/ISSUES/\n`);

  for (const file of files) {
    const filePath = path.join(issuesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Parse title & labels from frontmatter or content
    let title = file.replace(/\.md$/, '');
    let labels: string[] = [];
    let body = content;

    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      body = frontmatterMatch[2].trim();

      const titleMatch = frontmatter.match(/title:\s*"(.*?)"|title:\s*(.*)/);
      if (titleMatch) title = titleMatch[1] || titleMatch[2];

      const labelsMatch = frontmatter.match(/labels:\s*"(.*?)"|labels:\s*(.*)/);
      if (labelsMatch) {
        const rawLabels = labelsMatch[1] || labelsMatch[2];
        labels = rawLabels.split(',').map(l => l.trim()).filter(Boolean);
      }
    }

    console.log(`⏳ Membuat issue: "${title}"...`);

    try {
      const res = await fetch('https://api.github.com/repos/damisaviola/loktim/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Loktim-Agent'
        },
        body: JSON.stringify({
          title,
          body,
          labels
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`❌ Gagal membuat issue "${title}": ${res.status} ${res.statusText}`);
        console.error(`   Detail: ${errText}`);
      } else {
        const data = await res.json() as any;
        console.log(`✅ BERHASIL! Issue terbit di: ${data.html_url}`);
      }
    } catch (err) {
      console.error(`❌ Error jaringan saat push "${title}":`, err);
    }
  }
}

pushIssues();
