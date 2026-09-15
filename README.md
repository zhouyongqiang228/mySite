# mySite

静态个人网站，无构建依赖。运行 `python3 -m http.server 5173` 后，访问
`http://localhost:5173/#skills` 查看交互技能树。

技能树组件：

- `skill-tree.js`：在 `groups` 中编辑领域，在 `skills` 中编辑技能名称、简介、标签和三维坐标；`group` 对应领域 ID。
- `skill-tree.css`：组件独立样式与响应式布局。
- `index.html`：`#skills` 为组件容器。

采用 Canvas 三维透视投影与 HTML 按钮，无需 WebGL 或第三方库。支持拖动旋转、领域筛选、键盘选择、暂停动画和重置视角。窄屏默认精简节点，通过领域筛选展开；减少动态效果偏好下默认静止，离屏或页面隐藏时停止组件动画。
