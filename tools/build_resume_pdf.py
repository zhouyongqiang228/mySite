from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "zhou-yongqiang-resume.pdf"
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
pdfmetrics.registerFont(TTFont("ResumeCJK", FONT_PATH))

NAVY = colors.HexColor("#10243a")
INK = colors.HexColor("#1d2b3a")
MUTED = colors.HexColor("#536577")
CYAN = colors.HexColor("#087f8c")
PALE = colors.HexColor("#edf7f8")
LINE = colors.HexColor("#c8d6df")


class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                         topMargin=15 * mm, bottomMargin=15 * mm, title="周永强 - 个人简历",
                         author="周永强")
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([PageTemplate(id="resume", frames=frame, onPage=draw_page)])


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 11 * mm, A4[0] - doc.rightMargin, 11 * mm)
    canvas.setFont("ResumeCJK", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 7 * mm, "周永强 | 医疗健康 AI 应用 / 软件工程")
    canvas.drawRightString(A4[0] - doc.rightMargin, 7 * mm, f"第 {doc.page} 页")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", fontName="ResumeCJK", fontSize=25, leading=29,
                          textColor=NAVY, spaceAfter=3))
styles.add(ParagraphStyle(name="Role", fontName="ResumeCJK", fontSize=10.5, leading=15,
                          textColor=CYAN, spaceAfter=4))
styles.add(ParagraphStyle(name="Contact", fontName="ResumeCJK", fontSize=8.5, leading=13,
                          textColor=MUTED, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="Section", fontName="ResumeCJK", fontSize=13, leading=17,
                          textColor=NAVY, spaceBefore=9, spaceAfter=5))
styles.add(ParagraphStyle(name="Body", fontName="ResumeCJK", fontSize=9, leading=14,
                          textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="Small", fontName="ResumeCJK", fontSize=8.2, leading=12.5,
                          textColor=MUTED))
styles.add(ParagraphStyle(name="JobHead", fontName="ResumeCJK", fontSize=9.5, leading=14,
                          textColor=NAVY, spaceAfter=1))
styles.add(ParagraphStyle(name="Date", fontName="ResumeCJK", fontSize=8.2, leading=13,
                          textColor=CYAN, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="Project", fontName="ResumeCJK", fontSize=9.3, leading=14,
                          textColor=NAVY, spaceAfter=2))
styles.add(ParagraphStyle(name="Tiny", fontName="ResumeCJK", fontSize=7.6, leading=11,
                          textColor=MUTED))
styles.add(ParagraphStyle(name="ResumeBullet", parent=styles["Body"], leftIndent=9, firstLineIndent=-7,
                          bulletIndent=0, spaceAfter=1.5))


def P(text, style="Body"):
    return Paragraph(text, styles[style])


def section(title):
    return [Spacer(1, 1 * mm), P(title, "Section"), HRFlowable(width="100%", thickness=0.7,
              color=CYAN, spaceBefore=0, spaceAfter=3)]


def job(date, company, title, summary, bullets):
    left = [P(f"<b>{company}</b>", "JobHead"), P(title, "Small")]
    right = [P(date, "Date")]
    head = Table([[left, right]], colWidths=[125 * mm, 40 * mm])
    head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                              ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
                              ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    body = [P(summary, "Small")] + [P(f"• {item}", "ResumeBullet") for item in bullets]
    return KeepTogether([head, *body, Spacer(1, 1 * mm)])


def project(name, period, text, tags):
    return KeepTogether([
        P(f"<b>{name}</b> <font color='#087f8c'>| {period}</font>", "Project"),
        P(text, "Small"),
        P(f"<font color='#087f8c'>{tags}</font>", "Tiny"),
        Spacer(1, 2.3 * mm),
    ])


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = ResumeDoc(str(OUTPUT))
    story = []

    header = Table([
        [P("周永强", "Name"), P('<link href="tel:13362748507">13362748507</link><br/><link href="mailto:zhouyongqiang2706@gmail.com">zhouyongqiang2706@gmail.com</link><br/><link href="https://autoact.app/my/">autoact.app/my</link>', "Contact")],
        [P("医疗健康 AI 应用 · AI Agent · 游戏引擎与跨平台软件", "Role"), ""],
    ], colWidths=[120 * mm, 45 * mm])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("SPAN", (0, 1), (1, 1)),
                                ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story += [header, Spacer(1, 3 * mm)]
    summary = Table([[P("<b>职业概述</b><br/>软件开发者与产品型工程负责人，拥有从自研引擎、游戏和跨平台客户端，到 Go 服务端、AI 应用与自动化工具的完整研发经验。当前优先寻找医疗健康 AI 应用、医学影像软件或 AI 工具研发岗位，能够将复杂需求拆解为可交付的产品能力。", "Body")]], colWidths=[165 * mm])
    summary.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                                 ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                 ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    story += [summary]

    story += section("核心能力")
    skills = [
        ("医疗健康 AI", "解剖学、影像学学习；LLM、RAG、AI Agent 与模型集成"),
        ("引擎与图形", "类 Unity 引擎、Unity/Cocos、C++、DirectX 9、OpenGL、Shader"),
        ("应用与平台", "Go / Python / C# / JavaScript；Flutter、iOS、Android、Web"),
        ("产品交付", "低代码平台、桌面自动化、数据分析、ASO、A/B 测试与产品运营"),
    ]
    skill_rows = []
    for i in range(0, len(skills), 2):
        row = []
        for label, text in skills[i:i + 2]:
            row.append(P(f"<b>{label}</b><br/>{text}", "Small"))
        skill_rows.append(row)
    skill_table = Table(skill_rows, colWidths=[81 * mm, 84 * mm], hAlign="LEFT")
    skill_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                                     ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                                     ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                                     ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    story += [skill_table]

    story += section("工作经历")
    story += [
        job("2024 - 2026", "Nuat Computer Software LLC", "CTO", "负责类 Unity 引擎与 AI 结合的低代码游戏开发平台，以及教学网站和游戏项目研发。", [
            "开发场景、节点、组件和运行时预览等编辑器能力。",
            "将 AI 辅助创作接入低代码工作流，推进从工具到产品的交付。",
        ]),
        job("2023", "独立开发", "AI 自动化与桌面工具开发者", "围绕自然语言自动化和桌面效率工具开展产品研发。", [
            "开发 AutoAct，将自然语言指令转化为可执行的计算机操作。",
            "开发 Window Fusion，将多个应用窗口整合到同一窗口。",
        ]),
        job("2022", "杭州拟仁智能科技有限公司", "多平台开发工程师", "参与 iOS 虚拟人客户端与图形渲染功能集成。", [
            "连接 C++、C#、Java、Objective-C 与 Dart 接口，支持多平台功能调用。",
        ]),
        job("2017 - 2022", "上海三沾网络科技有限公司", "创始人 / CEO", "兼顾游戏主程、策划与运营，负责休闲游戏和应用研发。", [
            "带领最多 5 人团队开发休闲游戏，2020 年起以个人独立开发为主。",
            "项目覆盖 AI 识图游戏、社交软件与配套 Go 服务端。",
        ]),
        job("2016", "独立开发", "独立游戏开发者", "独立开发休闲游戏及配套工具，积累完整的产品研发与发布经验。", []),
        job("2014 - 2015", "上海涅磐网络科技有限公司", "游戏客户端开发工程师", "使用 Cocos2d-x 与 Lua 开发手游客户端，负责战斗系统、角色 AI 与技能特效。", []),
        job("2013 - 2014", "广州多益网络科技有限公司", "游戏客户端主程", "使用 Cocos2d-x 与 Python 开发手游客户端，参与角色 AI、寻路与引擎优化。", []),
    ]

    story.append(PageBreak())
    story += section("精选项目")
    story += [
        project("类 Unity 引擎 + AI 低代码平台", "2024 - 2026", "研发结合类 Unity 编辑器、运行时预览和 AI 辅助创作的低代码游戏开发平台，让创作者通过场景、节点和组件快速搭建游戏。", "低代码 · 游戏引擎 · AI 应用"),
        project("AutoAct", "2023", "将自然语言指令转化为计算机操作的 AI 应用，支持指令理解、模型调用与任务执行。", "自然语言交互 · AI Agent · 桌面自动化"),
        project("社交软件", "2021 - 2022", "独立开发 Flutter 移动客户端与 Go 服务端，支持 iOS / Android，包含数据库、缓存、消息推送与自研消息队列。", "Flutter · Go · SQL / Redis"),
        project("神笔马良 AI 游戏", "2021", "用 TensorFlow 训练图像识别模型，把玩家草图转化为游戏对象与交互，例如画猫生成猫、画火触发场景互动。", "TensorFlow · 图像识别 · 游戏交互"),
        project("数十个休闲游戏", "2016 - 2021", "开发与维护 50+ 中轻度游戏，负责游戏逻辑、动画、物理、AI、渲染、UI、性能优化以及地图编辑器和 A/B 测试工具。", "Unity / Cocos · AI · 产品发行"),
        project("游戏数据分析平台", "2020", "使用 C++ 开发分析前端、Go 开发后端并提供 C# SDK，分析留存、生命周期价值、关卡流失与广告流失等指标。", "C++ / Go · C# SDK · 数据分析"),
        project("3D 引擎与类 C 解释语言", "2010 - 2012", "基于 DirectX 9 固定渲染管线开发 3D 引擎，实现碰撞检测、UI、粒子、纹理与八叉树场景管理，并以 C++ 实现类 C 解释型脚本语言。", "DirectX 9 · C++ · 解释器"),
    ]

    story += section("教育与荣誉")
    story += [P("<b>湖州师范大学</b> · 信息与计算科学 · 本科（2009 - 2013）", "Body"),
              P("浙江省大学生程序设计竞赛二等奖 · Google 全国程序设计邀请赛铜牌 · 两次通过 ACM/ICPC 网络赛选拔并参加亚洲区域赛 · 全国第九届高中生物学联赛浙江省三等奖", "Small")]

    story += section("投递信息")
    story += [P("个人主页：<link href='https://autoact.app/my/' color='#087f8c'>https://autoact.app/my/</link>　|　邮箱：<link href='mailto:zhouyongqiang2706@gmail.com' color='#087f8c'>zhouyongqiang2706@gmail.com</link>", "Body"),
              P("可优先考虑岗位：医疗健康 AI 应用、医学影像软件、AI Agent / 自动化工具、游戏引擎与跨平台软件研发。", "Small")]
    doc.build(story)


if __name__ == "__main__":
    build()
    print(OUTPUT)
