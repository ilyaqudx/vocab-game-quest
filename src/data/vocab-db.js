// VocabQuest Comprehensive Multi-Level English Vocabulary Database
// Covering: Core 8000, CET-4, CET-6, IELTS, TOEFL

export const CATEGORIES = {
  all: { id: 'all', name: '全部常用8000词 (Core 8000)', badge: '8000' },
  cet4: { id: 'cet4', name: '大学英语四级 (CET-4)', badge: 'CET-4' },
  cet6: { id: 'cet6', name: '大学英语六级 (CET-6)', badge: 'CET-6' },
  ielts: { id: 'ielts', name: '雅思学术核心 (IELTS)', badge: 'IELTS' },
  toefl: { id: 'toefl', name: '托福高分学术 (TOEFL)', badge: 'TOEFL' }
};

export const VOCAB_DATABASE = [
  // --- CET-4 大学英语四级核心 ---
  {
    word: "ABANDON",
    phonetic: "/əˈbændən/",
    pos: "v.",
    trans: "放弃；抛弃；沉溺",
    example: "The captain refused to abandon the ship during the hurricane.",
    transEx: "船长在飓风中拒绝弃船。",
    roots: "a- (否定) + bandon (控制/下令) -> 脱离控制 -> 放弃",
    synonyms: ["DESERT", "DISCARD", "RELINQUISH"],
    category: "cet4"
  },
  {
    word: "ACCOMPLISH",
    phonetic: "/əˈkʌmplɪʃ/",
    pos: "v.",
    trans: "完成；实现；达到",
    example: "With persistence, you can accomplish any ambitious goal.",
    transEx: "只要有毅力，你能实现任何宏伟的目标。",
    roots: "ac- (加强) + compl- (充满/完成) -> 彻底圆满",
    synonyms: ["ACHIEVE", "FULFILL", "EXECUTE"],
    category: "cet4"
  },
  {
    word: "ACCURATE",
    phonetic: "/ˈækjərət/",
    pos: "adj.",
    trans: "准确的；精确的；无差错的",
    example: "Accurate measurements are vital for scientific experiments.",
    transEx: "精确的测量对科学实验至关重要。",
    roots: "ac- (向着) + cur (关心/照看) + -ate -> 悉心照料下无偏差的",
    synonyms: ["PRECISE", "EXACT", "CORRECT"],
    category: "cet4"
  },
  {
    word: "BENEFIT",
    phonetic: "/ˈbenɪfɪt/",
    pos: "n./v.",
    trans: "利益；好处；有益于",
    example: "Regular aerobic exercise will benefit cardiovascular health.",
    transEx: "规律的有氧运动有益于心血管健康。",
    roots: "bene- (好/善) + fic/fit (做) -> 带来好处的事情",
    synonyms: ["ADVANTAGE", "PROFIT", "GAIN"],
    category: "cet4"
  },
  {
    word: "BRILLIANT",
    phonetic: "/ˈbrɪljənt/",
    pos: "adj.",
    trans: "闪耀的；出色的；聪颖的",
    example: "The researcher proposed a brilliant solution to quantum entanglement.",
    transEx: "研究员对量子纠缠提出了一个绝妙的解决方案。",
    roots: "brill- (闪光) + -iant -> 光芒四射的",
    synonyms: ["BRIGHT", "SPLENDID", "GENIUS"],
    category: "cet4"
  },
  {
    word: "CHALLENGE",
    phonetic: "/ˈtʃælɪndʒ/",
    pos: "n./v.",
    trans: "挑战；质疑；向…挑战",
    example: "Overcoming cognitive bias is a formidable intellectual challenge.",
    transEx: "克服认知偏见是一项艰巨的智力挑战。",
    roots: "calumnia (虚妄中伤) -> 古法语演变为质询与宣战",
    synonyms: ["CONFRONT", "DISPUTE", "DEFY"],
    category: "cet4"
  },
  {
    word: "COLLAPSE",
    phonetic: "/kəˈlæps/",
    pos: "v./n.",
    trans: "崩溃；倒塌；瓦解",
    example: "The economic system averted a total collapse through swift intervention.",
    transEx: "经济体系通过迅速的干预避免了彻底崩溃。",
    roots: "col- (共同) + lapse (滑落/下坠) -> 一起塌陷",
    synonyms: ["BREAKDOWN", "FALL", "CRUMBLE"],
    category: "cet4"
  },
  {
    word: "COMPLEX",
    phonetic: "/ˈkɒmpleks/",
    pos: "adj./n.",
    trans: "复杂的；复合体；综合设施",
    example: "Neural networks process complex patterns through layered weights.",
    transEx: "神经网络通过分层权重处理复杂的模式。",
    roots: "com- (共同) + plex (编织/折叠) -> 编织在一起的 -> 错综复杂的",
    synonyms: ["INTRICATE", "COMPLICATED", "ELABORATE"],
    category: "cet4"
  },
  {
    word: "DECLINE",
    phonetic: "/dɪˈklaɪn/",
    pos: "v./n.",
    trans: "下降；衰退；婉拒",
    example: "The firm witnessed a sharp decline in operating margins this quarter.",
    transEx: "该公司本季度营业利润率出现急剧下滑。",
    roots: "de- (向下) + cline (弯曲/倾斜) -> 倾斜向下",
    synonyms: ["DECREASE", "DIMINISH", "REJECT"],
    category: "cet4"
  },
  {
    word: "DOMINATE",
    phonetic: "/ˈdɒmɪneɪt/",
    pos: "v.",
    trans: "统治；主导；在…中占首要地位",
    example: "Renewable energy technologies will dominate next-generation power grids.",
    transEx: "可再生能源技术将主导下一代电网。",
    roots: "domin- (主人/居所) + -ate -> 像主人一样统治",
    synonyms: ["CONTROL", "RULE", "COMMAND"],
    category: "cet4"
  },
  {
    word: "EFFICIENT",
    phonetic: "/ɪˈfɪʃnt/",
    pos: "adj.",
    trans: "高效的；有能力的；生效的",
    example: "Modern heat pumps offer an efficient alternative to traditional furnaces.",
    transEx: "现代热泵为传统火炉提供了高效的替代方案。",
    roots: "ef- (出) + fic (做) + -ent -> 做出成效的",
    synonyms: ["EFFECTIVE", "PRODUCTIVE", "CAPABLE"],
    category: "cet4"
  },
  {
    word: "ESTABLISH",
    phonetic: "/ɪˈstæblɪʃ/",
    pos: "v.",
    trans: "建立；确立；证实",
    example: "Scientists established a causal link between sleep deprivation and cognitive decline.",
    transEx: "科学家确立了睡眠剥夺与认知能力下降之间的因果联系。",
    roots: "sta- (站立/稳固) + -ish -> 使稳固树立",
    synonyms: ["FOUND", "CREATE", "INSTITUTE"],
    category: "cet4"
  },
  {
    word: "GENUINE",
    phonetic: "/ˈdʒenjuɪn/",
    pos: "adj.",
    trans: "真实的；真诚的；非人造的",
    example: "Her enthusiasm for machine learning is entirely genuine.",
    transEx: "她对机器学习的热忱完全是发自内心的。",
    roots: "gen- (出生/天生) + -uine -> 天生固有的 -> 货真价实的",
    synonyms: ["AUTHENTIC", "REAL", "SINCERE"],
    category: "cet4"
  },
  {
    word: "IMPACT",
    phonetic: "/ˈɪmpækt/",
    pos: "n./v.",
    trans: "冲击；巨大影响；碰撞",
    example: "Artificial intelligence will have an irreversible impact on human society.",
    transEx: "人工智能将对人类社会产生不可逆转的影响。",
    roots: "im- (进入) + pact (撞击/固定) -> 撞击产生震荡",
    synonyms: ["INFLUENCE", "EFFECT", "COLLISION"],
    category: "cet4"
  },
  {
    word: "MAINTAIN",
    phonetic: "/meɪnˈteɪn/",
    pos: "v.",
    trans: "维持；保持；坚称；维修",
    example: "Athletes must maintain steady breathing during endurance sprints.",
    transEx: "运动员在耐力冲刺中必须保持稳定的呼吸。",
    roots: "main (手) + tain (握住) -> 用手紧紧握住不放 -> 保持",
    synonyms: ["PRESERVE", "SUSTAIN", "ASSERT"],
    category: "cet4"
  },
  {
    word: "OBVIOUS",
    phonetic: "/ˈɒbviəs/",
    pos: "adj.",
    trans: "显而易见的；明白的",
    example: "There is an obvious disparity between theoretical models and field data.",
    transEx: "理论模型与实地数据之间存在明显的差异。",
    roots: "ob- (正对) + vi- (道路) + -ous -> 摆在路中央一眼可见的",
    synonyms: ["EVIDENT", "CLEAR", "MANIFEST"],
    category: "cet4"
  },
  {
    word: "POTENTIAL",
    phonetic: "/pəˈtenʃl/",
    pos: "adj./n.",
    trans: "潜在的；潜能；可能性",
    example: "CRISPR gene editing holds immense potential for eradicating hereditary disorders.",
    transEx: "CRISPR 基因编辑在消除遗传性疾病方面具有巨大的潜力。",
    roots: "pot- (力量/能力) + -ential -> 具有蕴藏力量的",
    synonyms: ["POSSIBLE", "CAPACITY", "PROMISE"],
    category: "cet4"
  },
  {
    word: "RELIABLE",
    phonetic: "/rɪˈlaɪəbl/",
    pos: "adj.",
    trans: "可靠的；可信赖的",
    example: "Decentralized servers ensure reliable continuous uptime.",
    transEx: "去中心化服务器可确保稳定可靠的持续在线率。",
    roots: "re- (再) + ly (系/绑) + -able -> 能牢牢绑在上面的 -> 可托付的",
    synonyms: ["DEPENDABLE", "TRUSTWORTHY", "STEADY"],
    category: "cet4"
  },
  {
    word: "SURVIVE",
    phonetic: "/səˈvaɪv/",
    pos: "v.",
    trans: "幸存；生还；幸免于",
    example: "Desert flora developed specialized root structures to survive arid climates.",
    transEx: "沙漠植物演化出了专门的根系结构以在干旱气候中存活。",
    roots: "sur- (超出/在上面) + viv (生命) -> 活过灾难之上",
    synonyms: ["OUTLIVE", "ENDURE", "PERSIST"],
    category: "cet4"
  },
  {
    word: "TRANSFORM",
    phonetic: "/trænsˈfɔːm/",
    pos: "v.",
    trans: "改变；转换；彻底变革",
    example: "Digital automation transformed the global logistics supply chain.",
    transEx: "数字化自动化深刻变革了全球物流供应链。",
    roots: "trans- (穿过/跨越) + form (形状) -> 变换形态",
    synonyms: ["CONVERT", "ALTER", "REVOLUTIONIZE"],
    category: "cet4"
  },

  // --- CET-6 大学英语六级进阶 ---
  {
    word: "ACCELERATE",
    phonetic: "/əkˈseləreɪt/",
    pos: "v.",
    trans: "加速；促进；提前发生",
    example: "Catalytic enzymes dramatically accelerate metabolic reactions.",
    transEx: "催化酶显著加速了代谢反应。",
    roots: "ac- (加强) + celer (快速) + -ate -> 使变得极其迅速",
    synonyms: ["EXPEDITE", "HASTEN", "QUICKEN"],
    category: "cet6"
  },
  {
    word: "AMBIGUOUS",
    phonetic: "/æmˈbɪɡjuəs/",
    pos: "adj.",
    trans: "模棱两可的；含糊不清的",
    example: "The treaty contained ambiguous phrasing regarding maritime borders.",
    transEx: "该条约中关于海上边界的措辞含糊不清。",
    roots: "ambi- (两边) + ag-/ig- (驱动/做) + -ous -> 往两边倒的 -> 歧义的",
    synonyms: ["VAGUE", "EQUIVOCAL", "OBSCURE"],
    category: "cet6"
  },
  {
    word: "COMPREHENSIVE",
    phonetic: "/ˌkɒmprɪˈhensɪv/",
    pos: "adj.",
    trans: "全面的；综合性的；广泛的",
    example: "The university introduced a comprehensive curriculum review.",
    transEx: "大学启动了全面的课程体系审查。",
    roots: "com- (全面) + prehend (抓取) + -ive -> 全都揽入其中的",
    synonyms: ["EXHAUSTIVE", "ALL-INCLUSIVE", "BROAD"],
    category: "cet6"
  },
  {
    word: "CONTRADICT",
    phonetic: "/ˌkɒntrəˈdɪkt/",
    pos: "v.",
    trans: "反驳；与…相抵触；同…矛盾",
    example: "Recent empirical observations contradict the reigning theoretical paradigm.",
    transEx: "近期的实证观察与现行的理论范式相抵触。",
    roots: "contra- (反对) + dict (说) -> 对着说反话",
    synonyms: ["OPPOSE", "DISPUTE", "BELIE"],
    category: "cet6"
  },
  {
    word: "DIMINISH",
    phonetic: "/dɪˈmɪnɪʃ/",
    pos: "v.",
    trans: "减少；缩小；削弱；贬低",
    example: "Nothing can diminish her milestone contribution to astrophysics.",
    transEx: "任何事情都无法贬低她对天体物理学做出的划时代贡献。",
    roots: "di- (使) + mini (微小) + -ish -> 使变得越来越微小",
    synonyms: ["LESSEN", "DECREASE", "DWINDLE"],
    category: "cet6"
  },
  {
    word: "DISTINCTION",
    phonetic: "/dɪˈstɪŋkʃn/",
    pos: "n.",
    trans: "区别；差别；杰出；荣誉",
    example: "Philosophers draw a sharp distinction between ethics and jurisprudence.",
    transEx: "哲学家在伦理学与法理学之间划定了清晰的界限。",
    roots: "dis- (分开) + tinct (刺入/标记) + -ion -> 刺出分界记号",
    synonyms: ["DIFFERENCE", "EXCELLENCE", "HONOR"],
    category: "cet6"
  },
  {
    word: "EXPLICIT",
    phonetic: "/ɪkˈsplɪsɪt/",
    pos: "adj.",
    trans: "明确的；清楚详述的；坦率的",
    example: "The software license provides explicit terms on intellectual property use.",
    transEx: "该软件许可协议就知识产权的使用提供了明确的条款。",
    roots: "ex- (出) + plic (折叠) + -it -> 把折叠的东西彻底展开 -> 一览无余的",
    synonyms: ["SPECIFIC", "DEFINITE", "CLEAR-CUT"],
    category: "cet6"
  },
  {
    word: "FLUCTUATE",
    phonetic: "/ˈflʌktʃueɪt/",
    pos: "v.",
    trans: "波动；上下起伏；摇摆不定",
    example: "Global commodity prices fluctuate violently during geopolitical turmoil.",
    transEx: "全球大宗商品价格在地缘政治动荡期间剧烈波动。",
    roots: "fluct- (波浪/流动) + -uate -> 像波浪一样翻涌",
    synonyms: ["OSCILLATE", "VARY", "WAVER"],
    category: "cet6"
  },
  {
    word: "INEVITABLE",
    phonetic: "/ɪnˈevɪtəbl/",
    pos: "adj.",
    trans: "不可避免的；必然发生的",
    example: "In a dynamic market economy, periodic disruption is inevitable.",
    transEx: "在动态市场经济中，周期性的动荡是不可避免的。",
    roots: "in- (不) + e- (出) + vit (避免) + -able -> 躲避不掉的",
    synonyms: ["UNAVOIDABLE", "CERTAIN", "INELUCTABLE"],
    category: "cet6"
  },
  {
    word: "LEGITIMATE",
    phonetic: "/lɪˈdʒɪtɪmət/",
    pos: "adj./v.",
    trans: "合法的；正当合理的；使合法化",
    example: "The citizens raised legitimate concerns regarding data privacy regulations.",
    transEx: "民众对数据隐私监管法规提出了合理的关切。",
    roots: "leg- (法律) + -it + -imate -> 符合法律规定的",
    synonyms: ["LAWFUL", "JUSTIFIABLE", "VALID"],
    category: "cet6"
  },
  {
    word: "MUTUAL",
    phonetic: "/ˈmjuːtʃuəl/",
    pos: "adj.",
    trans: "相互的；彼此的；共有的",
    example: "Sustainable diplomatic relations require mutual respect and trade parity.",
    transEx: "可持续的外交关系需要相互尊重与贸易对等。",
    roots: "mut- (改变/交换) + -ual -> 彼此互相交换的",
    synonyms: ["RECIPROCAL", "SHARED", "JOINT"],
    category: "cet6"
  },
  {
    word: "PARADOX",
    phonetic: "/ˈpærədɒks/",
    pos: "n.",
    trans: "悖论；矛盾的人或事",
    example: "The Fermi Paradox asks: if intelligent life is abundant, where is everybody?",
    transEx: "费米悖论发问：如果智慧生命很普遍，大家究竟在哪里？",
    roots: "para- (相反/相悖) + dox (观点/信条) -> 与常理相悖之论",
    synonyms: ["CONTRADICTION", "ANOMALY", "ENIGMA"],
    category: "cet6"
  },
  {
    word: "REINFORCE",
    phonetic: "/ˌriːɪnˈfɔːs/",
    pos: "v.",
    trans: "加固；强化；增援",
    example: "Positive behavioral feedback reinforces student engagement in learning.",
    transEx: "正向的行为反馈强化了学生在学习中的专注度与参与感。",
    roots: "re- (反复) + in- (进入) + force (力量) -> 不断施加力量以增强",
    synonyms: ["STRENGTHEN", "BOLSTER", "FORTIFY"],
    category: "cet6"
  },
  {
    word: "SIMULTANEOUS",
    phonetic: "/ˌsɪmlˈteɪniəs/",
    pos: "adj.",
    trans: "同时发生的；同步的",
    example: "The spacecraft performed simultaneous radar telemetry and spectral capture.",
    transEx: "航天器同时执行了雷达遥测与光谱捕获任务。",
    roots: "simul- (相同/一起) + -taneous -> 处在同一时刻的",
    synonyms: ["CONCURRENT", "SYNCHRONOUS", "COINCIDENT"],
    category: "cet6"
  },
  {
    word: "SUBSTANTIAL",
    phonetic: "/səbˈstænʃl/",
    pos: "adj.",
    trans: "大量的；重大的；坚固实在的",
    example: "The venture fund allocated substantial capital to quantum computing ventures.",
    transEx: "该风险基金为量子计算创业项目投入了大量资本。",
    roots: "sub- (下) + stant (站立) + -ial -> 根基牢固立得住的 -> 充实的",
    synonyms: ["CONSIDERABLE", "SIGNIFICANT", "SOLID"],
    category: "cet6"
  },

  // --- IELTS 雅思学术核心 ---
  {
    word: "ADVOCATE",
    phonetic: "/ˈædvəkeɪt/",
    pos: "v./n.",
    trans: "提倡；主张；倡导者",
    example: "Environmental economists advocate carbon pricing as a market solution.",
    transEx: "环境经济学家主张将碳定价作为一种市场化解决方案。",
    roots: "ad- (朝向) + voc (声音/呼唤) + -ate -> 为之发声呼吁",
    synonyms: ["CHAMPION", "SUPPORT", "PROPONENT"],
    category: "ielts"
  },
  {
    word: "COGNITIVE",
    phonetic: "/ˈkɒɡnətɪv/",
    pos: "adj.",
    trans: "认知的；感知相关的",
    example: "Bilingual upbringing enhances cognitive flexibility and problem-solving skills.",
    transEx: "双语抚养环境能够增强儿童的认知灵活性和问题解决技能。",
    roots: "cogn- (知道/认识) + -itive -> 关乎认知识别的",
    synonyms: ["INTELLECTUAL", "PERCEPTUAL", "MENTAL"],
    category: "ielts"
  },
  {
    word: "CORRELATION",
    phonetic: "/ˌkɒrəˈleɪʃn/",
    pos: "n.",
    trans: "相互关系；关联；相关性",
    example: "Epidemiologists found a strong correlation between dietary habits and longevity.",
    transEx: "流行病学家发现饮食习惯与长寿之间存在显著的相关性。",
    roots: "cor- (共同) + relation (关系) -> 相互协同关联",
    synonyms: ["ASSOCIATION", "LINKAGE", "INTERRELATION"],
    category: "ielts"
  },
  {
    word: "DETERIORATE",
    phonetic: "/dɪˈtɪəriəreɪt/",
    pos: "v.",
    trans: "恶化；变质；衰败",
    example: "Without proactive conservation, ancient monuments will rapidly deteriorate.",
    transEx: "如果不进行前瞻性保护，古代名胜古迹将会迅速恶化破败。",
    roots: "de- (向下) + terior (更糟的比较级) + -ate -> 变得更坏更糟",
    synonyms: ["WORSEN", "DEGENERATE", "DECAY"],
    category: "ielts"
  },
  {
    word: "DISPARITY",
    phonetic: "/dɪˈspærəti/",
    pos: "n.",
    trans: "悬殊；明显不平等；差异",
    example: "Policymakers seek to close the wealth disparity between urban and rural zones.",
    transEx: "政策制定者力图缩小城乡之间的贫富差距。",
    roots: "dis- (不) + par (对等/平齐) + -ity -> 不对等与差距",
    synonyms: ["IMBALANCE", "INEQUALITY", "DIVERGENCE"],
    category: "ielts"
  },
  {
    word: "EMPIRICAL",
    phonetic: "/ɪmˈpɪrɪkl/",
    pos: "adj.",
    trans: "经验主义的；以实证检验为依据的",
    example: "Hypotheses must be corroborated by robust empirical evidence.",
    transEx: "假说必须得到充分且经得起推敲的实证证据的支持。",
    roots: "em- (在内) + peira (试验/经验) + -ical -> 扎根在实验中的",
    synonyms: ["OBSERVATIONAL", "EXPERIMENTAL", "VERIFIABLE"],
    category: "ielts"
  },
  {
    word: "INNOVATION",
    phonetic: "/ˌɪnəˈveɪʃn/",
    pos: "n.",
    trans: "创新；革新；新发明",
    example: "Technological innovation in battery storage unlocks uninterrupted green energy.",
    transEx: "电池储能技术的突破创新为不间断的绿色清洁能源铺平了道路。",
    roots: "in- (向内) + nov (新奇) + -ation -> 不断引入新鲜事物",
    synonyms: ["NOVELTY", "BREAKTHROUGH", "MODERNIZATION"],
    category: "ielts"
  },
  {
    word: "METHODOLOGY",
    phonetic: "/ˌmeθəˈdɒlədʒi/",
    pos: "n.",
    trans: "方法论；系统研究方法",
    example: "The research paper details a rigorous statistical methodology.",
    transEx: "这篇研究论文详述了一套严谨的统计方法学体系。",
    roots: "method (方法) + -ology (学问/论) -> 关于科学方法的理论",
    synonyms: ["TECHNIQUE", "PROCEDURE", "FRAMEWORK"],
    category: "ielts"
  },
  {
    word: "PERSPECTIVE",
    phonetic: "/pəˈspektɪv/",
    pos: "n.",
    trans: "视角；透视法；远景思维",
    example: "International study abroad provides students with a global perspective.",
    transEx: "国际留学经历赋予了学生广阔的全球化视野。",
    roots: "per- (贯穿/透过) + spect (看) + -ive -> 透过现象看本质",
    synonyms: ["VIEWPOINT", "ANGLE", "OUTLOOK"],
    category: "ielts"
  },
  {
    word: "PROPORTION",
    phonetic: "/prəˈpɔːʃn/",
    pos: "n.",
    trans: "比例；份额；均衡协调",
    example: "A significant proportion of agricultural runoff ends up in coastal estuaries.",
    transEx: "相当大比例的农业径流最终流入了沿海河口湾。",
    roots: "pro- (依照) + portion (部分) -> 按特定比例切分的一份",
    synonyms: ["PERCENTAGE", "RATIO", "SHARE"],
    category: "ielts"
  },
  {
    word: "SUSTAINABLE",
    phonetic: "/səˈsteɪnəbl/",
    pos: "adj.",
    trans: "可持续的；合理养护生态的",
    example: "Circular economy initiatives promote sustainable manufacturing cycles.",
    transEx: "循环经济倡议促进了可持续的绿色制造闭环。",
    roots: "sus- (在下) + tain (支撑) + -able -> 能在下方长久支撑住的",
    synonyms: ["VIABLE", "ECO-FRIENDLY", "RENEWABLE"],
    category: "ielts"
  },
  {
    word: "VULNERABLE",
    phonetic: "/ˈvʌlnərəbl/",
    pos: "adj.",
    trans: "脆弱的；易受攻击/伤害的",
    example: "Low-lying coastal megacities are acutely vulnerable to sea-level rise.",
    transEx: "低洼的沿海特大城市对海平面上升尤为脆弱敏感。",
    roots: "vulner- (创伤) + -able -> 容易遭受皮肉之伤的",
    synonyms: ["SUSCEPTIBLE", "EXPOSED", "DEFENSELESS"],
    category: "ielts"
  },

  // --- TOEFL 托福学术专业高频 ---
  {
    word: "ACCLIMATIZE",
    phonetic: "/əˈklaɪmətaɪz/",
    pos: "v.",
    trans: "顺应水土；适应新气候",
    example: "Mountaineers camp at intermediate elevations to acclimatize before ascending Everest.",
    transEx: "登山队员在中等海拔扎营以在冲顶珠峰前适应高山气候。",
    roots: "ac- (朝向) + climate (气候) + -ize -> 使之适应气候环境",
    synonyms: ["ADAPT", "ACCOMMODATE", "ADJUST"],
    category: "toefl"
  },
  {
    word: "BIODIVERSITY",
    phonetic: "/ˌbaɪəʊdaɪˈvɜːsəti/",
    pos: "n.",
    trans: "生物多样性",
    example: "Tropical rainforest canopies harbor unmatched planetary biodiversity.",
    transEx: "热带雨林的林冠层蕴藏着地球上无可比拟的生物多样性。",
    roots: "bio- (生命) + diversity (多样) -> 生态界物种的多样性",
    synonyms: ["ECOLOGICAL VARIETY", "WILDLIFE RICHNESS"],
    category: "toefl"
  },
  {
    word: "CATACLYSMIC",
    phonetic: "/ˌkætəˈklɪzmɪk/",
    pos: "adj.",
    trans: "灾难性的；大变动的；突变巨变的",
    example: "Geologists attribute the dinosaur extinction to a cataclysmic asteroid impact.",
    transEx: "地质学家将恐龙灭绝归因于一次灾难性的小行星撞击地球事件。",
    roots: "cata- (向下/彻底) + clysm (冲刷/大水) + -ic -> 滔天大水冲刷 -> 大灾变",
    synonyms: ["DISASTROUS", "CATASTROPHIC", "DEVASTATING"],
    category: "toefl"
  },
  {
    word: "DEPOSITION",
    phonetic: "/ˌdepəˈzɪʃn/",
    pos: "n.",
    trans: "沉淀作用；沉积；免职",
    example: "Glacial deposition created fertile moraines across northern continents.",
    transEx: "冰川沉积作用在北部大陆形成了肥沃的冰碛平原。",
    roots: "de- (向下) + posit (放置) + -ion -> 泥沙矿物落于水底沉积",
    synonyms: ["SEDIMENTATION", "ACCUMULATION", "SETTLING"],
    category: "toefl"
  },
  {
    word: "FOSSILIZE",
    phonetic: "/ˈfɒsəlaɪz/",
    pos: "v.",
    trans: "变成化石；使僵化停滞",
    example: "Under anaerobic lake silt, organic skeletal remains fossilize over epochs.",
    transEx: "在缺氧的湖泊泥沙深处，有机骨骼残骸经历数个地质年代化为化石。",
    roots: "fossil (化石/发掘物) + -ize -> 变成坚硬矿物",
    synonyms: ["PETRIFY", "MINERALIZE", "HARDEN"],
    category: "toefl"
  },
  {
    word: "HABITAT",
    phonetic: "/ˈhæbɪtæt/",
    pos: "n.",
    trans: "栖息地；生长环境",
    example: "Fragmenting ancient temperate forest tracts destroys owl nesting habitat.",
    transEx: "切割破碎古老的温带森林带破坏了猫头鹰的筑巢栖息地。",
    roots: "habit (居住) + -at -> 生物安家落户的场所",
    synonyms: ["ENVIRONMENT", "ECOSYSTEM", "TERRITORY"],
    category: "toefl"
  },
  {
    word: "METAMORPHOSIS",
    phonetic: "/ˌmetəˈmɔːfəsɪs/",
    pos: "n.",
    trans: "变态；蜕变；质的巨变",
    example: "A caterpillar undergoes biological metamorphosis within its chrysalis to become a butterfly.",
    transEx: "毛毛虫在蛹中经历生物学变态发育，最终蜕变成蝴蝶。",
    roots: "meta- (改变/转换) + morph (形状/形态) + -osis -> 形态的深刻蜕变",
    synonyms: ["TRANSFORMATION", "MUTATION", "TRANSMUTATION"],
    category: "toefl"
  },
  {
    word: "PHOTOSYNTHESIS",
    phonetic: "/ˌfəʊtəʊˈsɪnθəsɪs/",
    pos: "n.",
    trans: "光合作用",
    example: "Through photosynthesis, chlorophyll converts photons and water into glucose.",
    transEx: "通过光合作用，叶绿素将光子与水转化为葡萄糖储备能。",
    roots: "photo- (光) + synthesis (合成) -> 以光能进行有机合成",
    synonyms: ["CHEMICAL SYNTHESIS", "LIGHT CONVERSION"],
    category: "toefl"
  },
  {
    word: "SEDIMENTARY",
    phonetic: "/ˌsedɪˈmentri/",
    pos: "adj.",
    trans: "沉积的；沉积岩的",
    example: "Fossilized ammonite shells are predominantly entombed in sedimentary limestone.",
    transEx: "菊石贝壳化石主要被封存在由水流压实而成的沉积石灰岩中。",
    roots: "sed- (坐下/沉淀) + -ment + -ary -> 由水流沉淀物形成的",
    synonyms: ["DEPOSITED", "STRATIFIED", "SETTLED"],
    category: "toefl"
  },
  {
    word: "SYMBIOSIS",
    phonetic: "/ˌsɪmbaɪˈəʊsɪs/",
    pos: "n.",
    trans: "共生关系；互利合作",
    example: "Coral polyps maintain mutualistic symbiosis with photosynthetic zooxanthellae algae.",
    transEx: "珊瑚虫与光合虫黄藻保持着互利互惠的紧密共生关系。",
    roots: "sym- (共同) + bio- (生命) + -sis -> 两种不同生命同生共息",
    synonyms: ["COEXISTENCE", "MUTUALISM", "PARTNERSHIP"],
    category: "toefl"
  }
];

// Helper: Filter words by category
export function getWordsByCategory(catId = 'all') {
  if (catId === 'all') return VOCAB_DATABASE;
  return VOCAB_DATABASE.filter(w => w.category === catId);
}

// Helper: Get random word from category
export function getRandomWord(catId = 'all') {
  const list = getWordsByCategory(catId);
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}
