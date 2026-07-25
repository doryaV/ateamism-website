ATEAMISM — GITHUB PAGES 上传包

目标仓库：
https://github.com/doryaV/ateamism-website

上传方法：
1. 解压 Ateamism-GitHub-Pages.zip。
2. 打开目标仓库。
3. 点击 Add file → Upload files。
4. 将 ateamism-github-pages 文件夹里面的全部内容拖入上传区域。
5. Commit message 填写：Publish Ateamism website
6. 点击 Commit changes。

上传完成后：
1. 进入仓库 Settings → Pages。
2. Build and deployment 的 Source 选择 GitHub Actions。
3. 返回 Actions 页面，等待 Deploy Ateamism to GitHub Pages 变为绿色。

访问地址：
https://doryav.github.io/ateamism-website/

注意：
- 必须上传 assets、publish 和 .github 文件夹。
- macOS 中按 Command + Shift + . 可以显示隐藏的 .github 文件夹。
- 网站已使用相对路径，能够在 /ateamism-website/ 子目录下运行。
