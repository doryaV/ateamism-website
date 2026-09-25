# Ateamism 12Axes 中文长版

本站的独立静态页面，发布路径为 `/12axes/`。无需构建步骤或服务器端代码。

## 集成

主页 `index.html` 已加入测试入口。发布站点根目录时，`12axes/index.html` 会出现在 `/12axes/`。

页面不会修改主页资源；答题进度只存入浏览器 `localStorage`。

## 来源与许可

题库、原始计分逻辑与 ideology 数据改编自 [PoliticalTests / 12Axes](https://github.com/politicaltests/politicaltests.github.io/tree/main/12axes)。上游仓库以 MIT License 发布，完整许可文本见 `LICENSE`。中文翻译为本项目新增内容。

长版计分严格保留上游算法：每条轴 24 题，答案乘数为 `2 / 1 / 0.5 / 0 / -0.5 / -1 / -2`；题目所属四个正向等级取正号，四个反向等级取负号；最终得分为 `50 + 累计分`，范围 `2–98`。
