// Personal skill catalog. Add a child to any branch; layout and counts are automatic.
(() => {
  const leaf = (id, name, description) => ({ id, name, description });
  window.skillCatalog = {
    id: 'root', name: '技能概览', en: 'MY KNOWLEDGE TREE',
    description: '以开发为基础，连接医学、AI 模型与多种产品实践。所有分支完整呈现，连接我的技能与项目经验。',
    children: [
      {
        id: 'medical', name: '医学', en: 'MEDICINE', color: '#a1d7c3',
        description: '从人体结构到医学影像，探索医学知识与软件技术的交叉应用。',
        children: [
          leaf('anatomy', '解剖学', '人体结构与空间关系的知识基础，也是医学内容数字化表达的重要线索。'),
          leaf('imaging', '影像学', '围绕医学影像与人体结构理解，连接医学知识、图像处理与可视化。'),
        ],
      },
      {
        id: 'ai', name: 'AI 模型', en: 'AI & MODELS', color: '#efb5b0',
        description: '从 TensorFlow 与识图模型，到语言模型和智能工作流，将 AI 能力接入实际应用。',
        children: [
          leaf('tensorflow', 'TensorFlow', '用于构建与运行机器学习模型的开发框架。'),
          leaf('llm', 'LLM 应用', '把语言模型的理解与生成能力接入产品和工作流。'),
          leaf('rag', 'RAG', '连接知识检索与生成过程，为模型提供相关上下文。'),
          leaf('agents', 'AI Agent', '连接模型、工具调用与多步骤任务，构建自动化工作流。'),
        ],
      },
      {
        id: 'development', name: '开发', en: 'SOFTWARE DEVELOPMENT', color: '#b7f5c9',
        description: '覆盖桌面、移动端、Web 与服务端，从编程语言、开发框架到完整产品交付。',
        children: [
          {
            id: 'platforms', name: '平台', description: '在不同设备与操作系统上构建应用和服务。',
            children: [
              leaf('windows', 'Windows', 'Windows 平台的软件与客户端应用开发。'),
              leaf('macos', 'macOS', 'macOS 平台的软件与客户端应用开发。'),
              leaf('ios', 'iOS', 'iPhone、iPad 等苹果移动设备上的应用开发。'),
              leaf('android', 'Android', 'Android 平台的移动应用开发。'),
              leaf('linux', 'Linux', 'Linux 环境下的软件与服务端开发。'),
              leaf('web', 'Web', '在浏览器中构建界面、交互和应用体验。'),
            ],
          },
          {
            id: 'languages', name: '语言', description: '从系统语言、应用语言到脚本、着色器、数据库和自研语言。',
            children: [
              leaf('cpp', 'C++', '用于引擎、原生应用和高性能软件的开发。'),
              leaf('c', 'C', '底层编程、内存管理与程序结构的基础。'),
              leaf('go', 'Go / Golang', '用于服务端、并发程序与开发工具。'),
              leaf('csharp', 'C#', '用于应用程序、工具以及 Unity 开发。'),
              leaf('python', 'Python', '用于脚本、数据处理、自动化与 AI 开发。'),
              leaf('javascript', 'JavaScript', '用于 Web 交互与脚本逻辑。'),
              leaf('swift', 'Swift', '用于苹果平台的原生应用开发。'),
              leaf('objective-c', 'Objective-C', '用于苹果平台的原生应用与现有工程开发。'),
              leaf('lua', 'Lua', '用于嵌入式脚本与游戏逻辑。'),
              leaf('dart', 'Dart', '用于 Flutter 应用与跨平台界面开发。'),
              leaf('html', 'HTML', '用于网页内容结构与界面组织。'),
              leaf('shader', 'Shader', '用于图形渲染、材质表达与视觉效果。'),
              leaf('sql', 'SQL', '用于数据库查询、数据组织与分析。'),
              leaf('custom-language', '类 C 解释语言', '用 C++ 实现类 C 解释型脚本语言，探索提升开发效率。'),
            ],
          },
          {
            id: 'frameworks', name: '开发框架', description: '围绕游戏、实时交互和跨平台应用组织开发流程。',
            children: [
              leaf('unity', 'Unity', '用于游戏、实时场景与交互应用开发。'),
              leaf('cocos', 'Cocos', '用于游戏逻辑、交互与产品实现。'),
              leaf('flutter', 'Flutter', '用于跨平台应用与统一的界面体验。'),
              leaf('directx', 'DirectX', '基于 DirectX 9 实现过自研 3D 引擎。'),
              leaf('opengl', 'OpenGL', '图形编程与实时渲染相关技能。'),
            ],
          },
          {
            id: 'projects', name: '项目经验', description: '涵盖引擎、游戏、服务端、客户端、内容工具和开发平台的项目实践。',
            children: [
              leaf('game-engine', '游戏引擎', '游戏引擎相关开发，连接运行逻辑、资源与实时表现。'),
              leaf('games', '游戏', '数十款休闲游戏的开发、维护与发行实践。'),
              leaf('servers', '服务器', '服务端程序、接口与业务逻辑开发。'),
              leaf('clients', '多平台客户端应用', '在多个操作系统与设备上交付客户端体验。'),
              leaf('image-video', '图片视频处理软件', '围绕图像与视频内容的处理、编辑或呈现构建软件。'),
              leaf('social', '社交软件', '围绕用户交流与连接构建应用。'),
              leaf('education', '教学软件', '将教学内容与学习过程组织为软件体验。'),
              leaf('language-dev', '编程语言开发', '围绕自研语言的表达方式、执行逻辑与应用场景进行开发。'),
              leaf('data-platform', '数据分析平台', '围绕数据处理、分析和结果呈现构建平台。'),
              leaf('low-code', '低代码开发平台', '降低开发门槛，让创作者用更少代码实现想法，包含低代码游戏开发实践。'),
              leaf('productivity', '效率工具软件', '围绕日常工作中的重复操作与流程构建效率工具。'),
              leaf('automation', '自动化工具', '将重复步骤和工具调用组织成可重复执行的流程。'),
              leaf('vision-model', '识图模型', '围绕图像识别与视觉理解开展模型相关开发。'),
            ],
          },
          {
            id: 'cross-domain', name: '综合能力', description: '把跨平台应用、图像视频工具、引擎和自研语言实践中的共同能力整理在一起。',
            children: [
              leaf('graphics', '图形学与实时交互', '连接图形渲染、Shader、游戏引擎与交互体验。'),
              leaf('cross-platform', '跨平台研发', '在桌面端、移动端与 Web 之间组织应用开发与交付。'),
              leaf('media-processing', '图像与视频处理', '把图像视频处理能力应用到内容工具和视觉相关软件。'),
              leaf('tooling', '开发工具与脚本系统', '连接自研脚本语言、低代码平台与自动化工具。'),
              leaf('aso', 'ASO', '应用商店优化与产品发行实践。'),
              leaf('mobile-marketing', '移动游戏推广', '移动游戏推广、获客测试与产品迭代。'),
              leaf('delivery', '产品研发与发布', '从原型、开发到发布迭代，推进产品进入实际使用。'),
            ],
          },
        ],
      },
    ],
  };
})();
