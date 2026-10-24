/* 他評頁（peer.html）的英文字典。中文原文在 js/peer-i18n.js、js/peer-report.js、js/peer-bank.js；
   js/peer-lang-en.src.json 記著翻譯時的中文，tests/peer-parity.test.mjs 會檢查中文改了英文有沒有跟著改。 */
window.PEER_LANG_EN = {
 "ui": {
  "title": "See Yourself from a Different Angle",
  "doc.title": "See Yourself from a Different Angle｜Inner Animal",
  "brand": "What's Your Inner Animal?",
  "theme": "Dark mode",
  "bar.lang.short": "中",
  "bar.lang": "Switch to Chinese 中文",
  "lang.fail": "English is unavailable right now. Showing Chinese.／英文版暫時無法使用，先顯示中文。",
  "copied": "Copied",
  "copyFail": "Could not copy automatically. Press and hold the link to copy it yourself",
  "loginFail": "Could not start signing in",
  "fail.t": "Can't reach the server",
  "fail.b": "Please check your connection and try again later.",
  "retry": "Try again",
  "nobackend.t": "Not available right now",
  "nobackend.b": "The site isn't fully set up yet. Please try again later.",
  "back.full": "See my full result",
  "lv.hi": "High",
  "lv.mh": "Fairly high",
  "lv.mid": "Medium",
  "lv.ml": "Fairly low",
  "lv.lo": "Low",
  "cham": "Chameleon",
  "cham.full": "Chameleon (Balanced)",
  "title.one": "{t} {animal} ({type})",
  "join.title": " + ",
  "join.names": " + ",
  "code.blend": ": {ab} Blend",
  "code.diag": ": {ab} Opposite Pair",
  "pair.self": "Your own view",
  "pair.peer": "Others' view",
  "pair.wait": "Waiting for replies",
  "need.t": "Please finish the main DISC test first",
  "need.b": "\"See Yourself from a Different Angle\" compares your own answers with how others see you, so you need to finish the main test first. After that, come back to this page to create an invite link. If you already signed in and saved your result, please sign in first.",
  "need.start": "Start the DISC test",
  "need.other": "Took it on another phone or computer?",
  "need.login": "Sign in",
  "need.home": "Back to home",
  "inv.lead": "The \"Johari Window,\" a psychology theory from 1955, says that feedback from other people helps us know ourselves more fully. Invite friends, family, teachers, or anyone else you trust to spend 2–3 minutes on a quick test, and see yourself \"from a different angle.\"",
  "inv.sub": "Invite them to spend 2–3 minutes picking the statements that are most like you and least like you from a few sets.",
  "inv.pairNote": "After they finish, you will see the two views side by side",
  "inv.nickQ": "What do people usually call you?",
  "inv.nickPh": "e.g. Sam, Sammy",
  "inv.nickHint": "Your friends will see this name in the questions.",
  "inv.nickHint2": "The question will read: \"Which statement is most like {v}?\"",
  "inv.go": "Create invite link",
  "inv.going": "Creating…",
  "inv.tip1": "We suggest inviting 3 or more people, so the result is more reliable and less affected by one person's impression",
  "inv.tip2": "People you invite can stay anonymous or leave their name",
  "inv.tip3": "The link does not expire. To invite more people later, just send the same link",
  "inv.errNoResult": "We can't find your test result. Please <a href=\"./\">finish the main test</a> first.",
  "inv.errFail": "Could not create the link. Please try again later.",
  "lk.share": "Send to a friend",
  "lk.line": "Send via LINE",
  "lk.copyInvite": "Copy invite link",
  "lk.copy": "Copy link",
  "lk.shareText": "Which animal is {nick} in your eyes?",
  "lk.ready": "Your invite link is ready",
  "lk.send": "Send it to friends, family, or teachers and ask them to spend 2–3 minutes picking the statements most like you. The questions will call you \"{nick}\".",
  "lk.n0": "No replies yet",
  "lk.n": "{n} replies so far",
  "lk.n.one": "{n} reply so far",
  "lk.seeCmp": "See the comparison",
  "lk.saved": "Saved to your account",
  "lk.savedB": "You can come back to it later in \"My past results\".",
  "lk.saveT": "Save your result link",
  "lk.saveB": "You will need it to come back and see how others see you. If you sign in, it is saved in your account, and you can see it on a new phone too.",
  "lk.google": "Sign in with Google to save",
  "lk.self": "Don't sign in, I'll save the link myself",
  "lk.selfB": "Keep it somewhere only you can see (for example, send it to yourself or bookmark it). <b>Do not</b> send it to anyone else. Anyone who has this link can see the results.",
  "lk.copyOwn": "Copy result link",
  "nf.t": "Invite not found",
  "nf.b": "The link may be incomplete. Please ask the person who invited you to send it again.",
  "cl.t": "This invite is not open right now",
  "cl.b": "The person who invited you has paused replies.",
  "rs.h1": "Which animal is<br>\"{nm}\" in your eyes?",
  "rs.lead": "This is a DISC behavioral style test. It uses four animals to describe how people work and get along with others. The Johari Window says some sides of us are clear to others but are blind spots to ourselves. Your choices can help \"{nm}\" know themselves better from another point of view.",
  "rs.count": "There are {n} questions. For each one, pick the statement that is <b>most like</b> \"{nm}\" and the one that is <b>least like</b> them. It takes about 2–3 minutes.",
  "rs.relQ": "You are \"{nm}\"'s…",
  "rs.relOtherQ": "What is your relationship?",
  "rs.relOtherPh": "e.g. coach, neighbor",
  "rs.nameQ": "Your name (optional)",
  "rs.nameNote": "If you leave it blank, you will show as Anonymous",
  "rs.hint": "Choose your relationship with \"{nm}\" to get started.",
  "rs.start": "Start",
  "q.progress": "Question {i} of {n}",
  "q.title": "Which statement is most like \"{nm}\"?<br>Which is least like them?",
  "q.most": "Most",
  "q.least": "Least",
  "q.aMost": "{w}: most like",
  "q.aLeast": "{w}: least like",
  "q.h0": "Pick one that is most like and one that is least like. You can't pick the same statement for both.",
  "q.h1": "Now pick one that is least like.",
  "q.h2": "Now pick one that is most like.",
  "q.h3": "All set. Going to the next question.",
  "q.h3last": "All set. Press \"Send\".",
  "q.prev": "Back",
  "q.next": "Next",
  "q.send": "Send",
  "q.sending": "Sending…",
  "q.again": "Send again",
  "q.cant": "Can't send",
  "q.e.closed": "This invite is not open, so your reply can't be sent.",
  "q.e.not_found": "We can't find this invite, so your reply can't be sent.",
  "q.e.network": "The connection is unstable. Please press Send again in a moment.",
  "q.e.invalid": "Sending failed. Please reload the page and answer again.",
  "lv.t": "Leave this page?",
  "lv.b": "Your answers will be lost and your reply won't be sent.",
  "lv.stay": "Keep going",
  "lv.go": "Leave",
  "rr.again": "You have already replied to \"{nm}\". This is your result from last time.",
  "rr.sent": "Your result has been sent to \"{nm}\". Thank you!",
  "rr.eyebrow": "\"{nm}\"'s inner animal in your eyes{code}",
  "rr.mix": "Inner animal mix",
  "rr.inEyes": "In your eyes",
  "rr.aria": "In your eyes, {nick}'s inner animal is {names}. Mix: {mix}",
  "rr.sep": ", ",
  "rr.n1": "A bigger share means that animal is stronger in your eyes.",
  "rr.top1": "The biggest share is {a}. This is \"{nm}\"'s inner animal in your eyes.",
  "rr.top2": "{a} and {b} have the biggest shares and they are close, so both are \"{nm}\"'s inner animals.",
  "rr.top3": "All four animals have similar shares, so in your eyes \"{nm}\" is a Chameleon.",
  "rr.full": "{name}'s full profile",
  "rr.seeFull": "See full profile",
  "rr.hide": "Hide profile",
  "rr.ref": "The test and the profile above are for reference only",
  "rr.del": "To have this reply deleted, see the <a href=\"{href}\">Privacy Policy</a>.",
  "cta.t": "Want to find out your own inner animal?",
  "cta.b1": "Based on the DISC theory by psychologist William Marston in 1928. It groups behavioral styles into four tendencies and uses four animals to stand for them.",
  "cta.b2": "Everyone has all four animals, just in different amounts. No type is better than another. Each type has its own strengths and blind spots.",
  "cta.meta": "{n} questions｜about 5–10 minutes｜Get your personal report for free",
  "cta.btn": "Find my inner animal",
  "ow.bad.t": "This link is no longer valid",
  "ow.bad.b": "A new link may have been created on another device, so the old result link can't be used any more. Please use the latest link, or sign in and open it again.",
  "ow.bad.back": "Back to the invite page",
  "ow.empty.t": "No replies yet",
  "ow.empty.b": "Send the invite link to friends, family, or teachers. Replies will appear here.",
  "ow.filter": "Filter by relationship",
  "ow.all": "All",
  "ow.few": "Only {n} people have replied so far. Invite a few more to make the result more stable.",
  "ow.who.all": "In the eyes of {n} people",
  "ow.who.rel": "In the eyes of {n} {rel}",
  "ow.eyebrow": "{who}, your inner animal{code}",
  "ow.s.up": "You described yourself as {a}. Others see you as more {f} than you think.",
  "ow.s.down": "You described yourself as {a}. You see yourself as {f}, but others feel it less.",
  "ow.s.same": "You described yourself as {a}. How others see you is very close to how you see yourself.",
  "ow.ask": "You could ask them: {q}",
  "ow.more.n": "{n} replies so far",
  "ow.more.n.one": "{n} reply so far",
  "ow.more.b": "Invite a few more for a fuller result.",
  "ow.cmpT": "The four animals, side by side",
  "ow.legSelf": "Your own view",
  "ow.legPeer": "Others' view (average of {n} people)",
  "ow.legPeer.one": "Others' view (1 person)",
  "ow.you": "You",
  "ow.others": "Others",
  "ow.less": "Less",
  "ow.avg": "Average",
  "ow.moreS": "More",
  "ow.cmpNote": "The middle line is the average of the four animals. Your own answers and the replies use different questions, so each side is converted separately. We only compare which animals are higher or lower in you. The labels on the right (High to Low) compare each animal with your own average.",
  "ow.eachT": "How each person sees you",
  "ow.anon": "Anonymous",
  "ow.anonMore": "{n} more people replied anonymously. They are only counted in the averages above.",
  "ow.anonAll": "All {n} replies are anonymous. They are only counted in the averages above.",
  "ow.ref": "The test results above are for reference only",
  "ow.swL": "Accept new replies",
  "ow.swD": "If you turn this off, the link still works but no new replies can be sent. You can turn it on again later.",
  "ow.swOn": "Now accepting new replies",
  "ow.swOff": "Stopped accepting new replies",
  "ow.swFail": "Couldn't change the setting. Please try again later."
 },
 "animal": {
  "D": "Tiger",
  "I": "Peacock",
  "S": "Koala",
  "C": "Owl"
 },
 "tname": {
  "D": "Dominance",
  "I": "Influence",
  "S": "Steadiness",
  "C": "Conscientiousness"
 },
 "rel": {
  "朋友": "Friend",
  "家人": "Family",
  "老師": "Teacher",
  "同學": "Classmate",
  "同事": "Coworker",
  "其他": "Other"
 },
 "relLo": {
  "朋友": "friend",
  "家人": "family member",
  "老師": "teacher",
  "同學": "classmate",
  "同事": "coworker",
  "其他": "other"
 },
 "relPl": {
  "朋友": "friends",
  "家人": "family members",
  "老師": "teachers",
  "同學": "classmates",
  "同事": "coworkers",
  "其他": "others"
 },
 "words": {
  "D1a": "Likes to take the lead",
  "D1b": "Likes to make their own decisions",
  "D1c": "Often hands out tasks",
  "D2a": "Decides quickly",
  "D2b": "Acts as soon as an idea comes",
  "D2c": "Cares about results",
  "D3a": "Gets more driven when it's hard",
  "D3b": "Likes to compete",
  "D3c": "Dares to take risks",
  "D4a": "Speaks directly",
  "D4b": "Says things face to face",
  "D4c": "Says no clearly",
  "I1a": "Gets close to people easily",
  "I1b": "Loves meeting new people",
  "I1c": "Often invites people to join in",
  "I2a": "Is good at persuading people",
  "I2b": "Has enthusiasm that spreads to others",
  "I2c": "Is good at encouraging people",
  "I3a": "Looks on the bright side",
  "I3b": "Often makes everyone laugh",
  "I3c": "Likes to keep things casual",
  "I4a": "Likes to share ideas",
  "I4b": "Is comfortable being noticed",
  "I4c": "Is very expressive when talking",
  "S1a": "Works at a steady pace",
  "S1b": "Prefers familiar ways of doing things",
  "S1c": "Is very patient",
  "S2a": "Is happy to help",
  "S2b": "Values teamwork",
  "S2c": "Likes to support from behind the scenes",
  "S3a": "Is a good listener",
  "S3b": "Notices what others need",
  "S3c": "Makes people feel at ease",
  "S4a": "Puts harmony first",
  "S4b": "Often goes along with others",
  "S4c": "Often says \"Anything is fine\"",
  "C1a": "Pays attention to details",
  "C1b": "Checks things again and again",
  "C1c": "Insists on getting things right",
  "C2a": "Works step by step",
  "C2b": "Follows the rules",
  "C2c": "Likes things neat and orderly",
  "C3a": "Does thorough research first",
  "C3b": "Trusts data",
  "C3c": "Verifies the facts first",
  "C4a": "Works carefully",
  "C4b": "Weighs the risks first",
  "C4c": "Tends to play it safe"
 },
 "report": {
  "TEXT": {
   "D": {
    "name": "Tiger",
    "code": "D Dominance",
    "one": "Once {name} sees a goal, they act on it and lead others to move things forward.",
    "core": [
     "{name} cares about results and efficiency. When a problem comes up, their first thought is usually \"How can I solve this?\" rather than \"Oh no, what now?\"",
     "{name} is willing to make decisions and to take responsibility for them.",
     "For {name}, difficulties are not a reason to back down. They are challenges worth taking on.",
     "{name} does their best when they can see progress and set their own direction.",
     "What tires {name} most is when things get stuck, or when the decision is not in their hands.",
     "Others sometimes think {name} is too direct, but that directness comes from wanting to make things better. It is not aimed at anyone."
    ],
    "good": [
     "Quick decisions: Even without complete information, {name} can choose a direction and get things moving.",
     "Ready for challenges: The harder the task, the more committed {name} becomes.",
     "Clear goals: When a discussion loses focus, {name} can bring everyone back to what really matters.",
     "Speaks up: When a problem comes up, {name} points it out directly instead of letting it drag on."
    ],
    "comm": [
     "{name} usually starts with the conclusion and prefers short, focused conversations.",
     "{name} appreciates people who say what they think directly, because it is the most efficient way.",
     "Vague or roundabout statements can leave {name} unsure what the other person really means."
    ],
    "commTip": "When talking with {name}, start with the main point and the conclusion, then add the details. If you disagree, say so directly and give your reasons. {name} will take it seriously.",
    "stress": [
     "Under pressure, {name} may become more forceful and impatient, and try to carry everything alone.",
     "{name} may also start giving orders to push things forward.",
     "Behind these reactions is often that {name} wants so much to do things well and keep them from getting out of control."
    ]
   },
   "I": {
    "name": "Peacock",
    "code": "I Influence",
    "one": "{name} brings energy to the people around them with enthusiasm and a gift for expression.",
    "core": [
     "{name} believes things will turn out well, and believes in people.",
     "{name} enjoys being with people and is good at moving them with enthusiasm and stories, so that everyone wants to join in.",
     "In a group, {name} is often the one who lifts the mood and helps strangers get to know each other quickly.",
     "{name} does their best when they are noticed and appreciated, and when they work with a lively group of people.",
     "What tires {name} most is working alone for a long time on repetitive tasks with little interaction.",
     "{name}'s enthusiasm is genuine. And because {name} cares about people, other people's reactions often affect their mood."
    ],
    "good": [
     "Contagious energy: {name}'s enthusiasm can lift everyone's spirits again.",
     "Good at expressing ideas: {name} can explain ideas in a vivid, concrete way that people want to listen to.",
     "Wide network: {name} easily builds relationships with people from different backgrounds.",
     "Optimistic and flexible: When things change, {name} quickly sees new possibilities."
    ],
    "comm": [
     "{name} speaks in a lively, expressive way and likes relaxed conversations with plenty of back and forth.",
     "{name} enjoys sharing their ideas and experiences.",
     "{name} is more easily moved by concrete stories and people than by cold numbers."
    ],
    "commTip": "When talking with {name}, start by creating a relaxed mood and give {name} room to speak. It is safer to confirm important details and deadlines in writing afterward.",
    "stress": [
     "Under pressure, {name}'s emotions may swing more, and {name} may speak faster.",
     "To avoid something unpleasant, {name} may put off things that need to be dealt with.",
     "Behind these reactions is often that {name} does not want to spoil the mood or let anyone down."
    ]
   },
   "S": {
    "name": "Koala",
    "code": "S Steadiness",
    "one": "{name}'s steadiness and patience help the people around them feel at ease and know they can rely on {name}.",
    "core": [
     "{name} values harmony and stability, and does best in a familiar, friendly setting, working at their own pace.",
     "{name} is a good listener, often notices before others who needs help, and is happy to support people quietly in the background.",
     "For {name}, a relationship built on trust matters more than beating someone else.",
     "{name} does their best when they know they are needed and the team trusts each other.",
     "What tires {name} most is frequent change and heated conflict.",
     "Others often find {name} easy to get along with. In fact, {name} has strong opinions inside, but usually takes care of everyone's feelings first."
    ],
    "good": [
     "Reliable: {name} follows through on what they promise, so people can hand things over with confidence.",
     "Patient: {name} is willing to take the time to do things well and to wait for others.",
     "Good listener: People feel understood and comfortable around {name}.",
     "The glue of the team: {name} can ease tension and make cooperation go more smoothly."
    ],
    "comm": [
     "{name} speaks gently and patiently, and usually listens to everyone's ideas before sharing their own.",
     "When rushed, or in a heated argument, {name} needs a little time to sort out their thoughts before saying what they really think."
    ],
    "commTip": "When talking with {name}, slow down your tone and give {name} time to think. To find out what {name} really thinks, ask in private and in a relaxed way.",
    "stress": [
     "Under pressure, {name} may become quiet and withdrawn, agreeing on the surface while not really agreeing inside.",
     "If the pressure builds up for a long time, it may suddenly burst out at some point.",
     "Behind these reactions is often that {name} always thinks of others first and puts their own feelings last."
    ]
   },
   "C": {
    "name": "Owl",
    "code": "C Conscientiousness",
    "one": "{name} likes to think things through and get them right before handing them over.",
    "core": [
     "{name} cares about quality and accuracy.",
     "When facing a task, {name} first makes sure of the standards, gathers enough information, and checks that the direction is right before starting.",
     "For {name}, \"getting it right\" matters more than \"getting it done fast,\" because a mistake that goes unnoticed often takes much more effort to fix later.",
     "{name} does their best when there are clear standards and enough time and information.",
     "What tires {name} most is rules that keep changing, or being asked to decide without any basis.",
     "Others sometimes find {name} strict or cool. But that strictness comes from caring, about the result and about not wanting others to suffer from a careless mistake."
    ],
    "good": [
     "Precise: {name} notices mistakes and gaps that others miss, so the result can stand up to checking.",
     "Strong analysis: {name} decides with logic and facts and is not easily swayed by emotion or by how something is said.",
     "Organized: {name} works step by step and stays consistent, so people feel safe handing things to {name}.",
     "Aware of risks: Before acting, {name} thinks about what could go wrong and prevents losses early."
    ],
    "comm": [
     "{name} speaks precisely and with evidence, and prefers discussions that are logical and based on information.",
     "When {name} hears something vague, {name} wants to ask first. This is not doubting the other person. It is making sure everyone understands the same thing."
    ],
    "commTip": "When talking with {name}, give specific information and clear expectations, and give {name} time to think. When you disagree, discussing facts works better than trying to persuade with emotion.",
    "stress": [
     "Under pressure, {name} may become more demanding about details, check things again and again, or not feel like discussing things with people for a while.",
     "Worry about making a mistake may also make {name} keep putting off a decision.",
     "Behind these reactions is often that {name} cares so much about doing things well."
    ]
   },
   "DI": {
    "name": "Tiger + Peacock",
    "code": "DI Blend",
    "one": "{name} has both drive and charisma, and can lead everyone toward a goal together.",
    "core": [
     "{name} has both the Tiger's decisiveness and the Peacock's enthusiasm, and the two are about equally strong.",
     "When {name} sees an opportunity, they want to act right away, and they naturally bring the people around them along.",
     "Rather than working hard alone, {name} is used to standing in front and leading a group forward.",
     "The Tiger side makes {name} willing to decide and take responsibility; the Peacock side helps {name} inspire people.",
     "{name} moves things forward not only by giving instructions, but also by sharing a vision and enthusiasm that make people want to follow.",
     "New and challenging things get {name} most involved. Work that never changes can easily make {name} lose motivation."
    ],
    "good": [
     "Can lead and can push: {name} can make decisions and also motivate everyone to act together.",
     "Good at starting new things: When a new opportunity comes up, {name} acts quickly and finds people who will support them.",
     "Persuasive: {name} speaks with confidence and warmth, so people want to believe them.",
     "Quick to respond: When things change, {name} can change direction right away and keep everyone moving."
    ],
    "comm": [
     "{name} speaks with enthusiasm, directness, and energy, and likes quick discussions and making decisions on the spot.",
     "{name} tends to talk about the vision and the big picture first, and going into details can feel slow.",
     "The more enthusiastic the other person's response, the more energized {name} feels."
    ],
    "commTip": "When talking with {name}, keep up with their pace. Talk about goals and direction first, then add the details. If you disagree, say so directly. Afterward, confirm important deadlines and who does what in writing.",
    "stress": [
     "Under pressure, {name} may become more impatient and forceful, want to control everything alone, or use persuasion and force of personality to override objections.",
     "{name} may also agree to even more things at once, leaving both themselves and the team overloaded.",
     "Behind these reactions is often how much {name} wants things to succeed."
    ]
   },
   "IS": {
    "name": "Peacock + Koala",
    "code": "IS Blend",
    "one": "{name} is warm and understanding, and makes the people around them feel valued.",
    "core": [
     "{name} has both the Peacock's enthusiasm and the Koala's caring nature, and the two are about equally strong.",
     "{name} values people, enjoys being with them, and cares a lot about how they feel.",
     "{name} is good at building relationships and creating a warm atmosphere, and is often the person who makes the team feel safe and comfortable.",
     "The Peacock side helps {name} start conversations and make friends easily; the Koala side makes {name} willing to listen and stay by people's side for the long run.",
     "{name}'s relationships are usually not only wide, but also deep.",
     "For {name}, getting along well and trusting each other is the starting point for getting things done well."
    ],
    "good": [
     "Well liked: People find {name} easy to approach and trust, and new friends quickly feel close.",
     "Strong empathy: {name} notices other people's feelings and needs and shows care at the right time.",
     "Good at coordinating: {name} can find an approach that everyone can accept among different opinions.",
     "Creates a good atmosphere: {name} makes cooperation feel easy, and new members fit in more easily."
    ],
    "comm": [
     "{name} speaks in a friendly, gentle way, likes to chat, and values two-way interaction.",
     "{name} usually asks about the other person first and then moves on to the business, and also pays attention to whether their words might make someone uncomfortable.",
     "When there is conflict, {name} tends to calm the mood first rather than argue about who is right on the spot."
    ],
    "commTip": "When talking with {name}, ask how they are doing before getting to business. If you need to give criticism, do it privately and gently, and let {name} know what you appreciate.",
    "stress": [
     "Under pressure, {name} may worry too much about what others think and keep holding back their own needs.",
     "When feeling low, {name} may not say so and keep smiling on the surface. After it builds up, {name} may suddenly feel very tired and want to get away from people for a while.",
     "Behind these reactions is often that {name} always takes care of others first."
    ]
   },
   "SC": {
    "name": "Koala + Owl",
    "code": "SC Blend",
    "one": "{name} is steady and down to earth, careful and dependable, a doer people can trust.",
    "core": [
     "{name} has both the Koala's steadiness and the Owl's carefulness, and the two are about equally strong.",
     "{name} works with a plan, step by step, and cares about quality as well as team harmony.",
     "{name} does not look for the spotlight, but everyone feels safe handing things to {name}.",
     "The Koala side makes {name} patient and willing to work with the team; the Owl side makes {name} pay attention to details and insist on getting things right.",
     "{name} is often the quiet gatekeeper of the team: not always the first to speak, but the one who notices what everyone missed and finishes things step by step."
    ],
    "good": [
     "Steady and reliable: The quality of {name}'s work is consistent, and mistakes are rare.",
     "Careful and organized: {name} cares about process and details, and plans the steps before starting.",
     "Can commit for the long term: {name} is willing to keep working patiently to do one thing well and keep it going.",
     "Keeps their word: {name} does what they promise, so people trust them."
    ],
    "comm": [
     "{name} speaks quietly and carefully, and thinks things through before speaking.",
     "{name} likes to know in advance what will be discussed. When {name} has time to prepare, their opinions are often very helpful.",
     "In a crowd or a tense situation, {name} usually watches first and seldom speaks up on the spot."
    ],
    "commTip": "When talking with {name}, tell them about changes ahead of time and give a clear explanation and time to prepare. To hear {name}'s opinion, send the questions in advance or ask in private.",
    "stress": [
     "Under pressure, {name} may become withdrawn and anxious, and hold even more firmly to the usual way of doing things.",
     "{name} may also keep worries inside, and check things again and again or work overtime alone to fix things.",
     "Behind these reactions is often that {name} does not want to let anyone down."
    ]
   },
   "CD": {
    "name": "Owl + Tiger",
    "code": "CD Blend",
    "one": "{name} is rational and decisive, and aims for results that are both fast and right.",
    "core": [
     "{name} has both the Owl's carefulness and the Tiger's decisiveness, and the two are about equally strong.",
     "{name} cares about facts and logic, and also about results.",
     "{name} holds high standards for themselves and for others, is good at analyzing problems, and pushes solutions forward.",
     "The Owl side lets {name} think clearly and see deeply; the Tiger side lets {name} make decisions and take responsibility.",
     "{name} does not stop at analysis, and does not act before thinking it through.",
     "With a complicated problem, {name} is often the one who calmly breaks it down and then says, \"Let's do it this way.\""
    ],
    "good": [
     "Thinks clearly and gets it done: Once the analysis is done, {name} can move it into action.",
     "High standards: {name} demands quality, so the results can stand up to checking.",
     "Objective: {name} focuses on the issue itself and is not easily swayed by emotion or personal ties.",
     "Can solve complex problems: When a hard problem comes up, {name} calmly breaks it down and finds the key."
    ],
    "comm": [
     "{name} speaks in a concise, rational way, points out problems directly, and explains the reasons.",
     "{name} prefers discussions with evidence and a conclusion, and has less patience for meetings without a point.",
     "{name}'s feedback is usually very specific, though it does not always consider first how it will feel to the listener."
    ],
    "commTip": "When talking with {name}, use data and logic, and bring up the problem and the solution directly. You can disagree, but have your reasons ready.",
    "stress": [
     "Under pressure, {name} may become more critical and stricter, take everything on themselves, and be unwilling to hand things to others.",
     "{name} may also raise the standards even higher, leaving both themselves and the team short of breath.",
     "Behind these reactions is often that {name} feels very responsible for the result."
    ]
   },
   "DS": {
    "name": "Tiger + Koala",
    "code": "DS Opposite Pair",
    "one": "{name} is firm yet caring, and can find a balance between goals and people.",
    "core": [
     "{name} has two traits that point in opposite directions: the Tiger's decisiveness and focus on results, and the Koala's patience and focus on harmony. Both are strong in {name}.",
     "In DISC theory, these two tendencies sit on opposite sides: one pushes things forward, and the other steadily goes along with others.",
     "{name} may switch between them depending on the situation: decisive and driving at work, but easygoing with friends or family.",
     "{name} may also be very firm about their goals while taking care of everyone's feelings in how they reach them.",
     "When the two traits work well together, {name} can get things moving and also make people want to follow."
    ],
    "good": [
     "Balances goals and people: {name} can push things forward without making people feel sacrificed.",
     "Firm but not harsh: {name} can hold their position and keep good relationships at the same time.",
     "Adjusts to the situation: Decisive when needed, accepting when needed.",
     "Trusted and followed: People know {name} has a direction, and they know {name} will look after them."
    ],
    "comm": [
     "{name} speaks directly or gently depending on the situation: clear and direct about goals and decisions, slower and more attentive when people's feelings are involved.",
     "{name} is usually willing to hear everyone out first, but often already has a direction in mind."
    ],
    "commTip": "To understand {name}, you can ask directly: \"Do you care more about the result here, or about how everyone feels?\" {name} will usually give you an honest answer.",
    "stress": [
     "Under pressure, {name} may swing between being forceful and giving in: one moment wanting to decide everything alone, the next going along with everything.",
     "{name} may also keep the peace on the surface while growing more and more irritated inside.",
     "Behind these reactions is often that {name} wants to take care of both the task and every person."
    ]
   },
   "IC": {
    "name": "Peacock + Owl",
    "code": "IC Opposite Pair",
    "one": "{name} is enthusiastic and careful, and can explain complex things in a way that is clear and interesting.",
    "core": [
     "{name} has two traits that point in opposite directions: the Peacock's warm, outgoing nature, and the Owl's precision and carefulness. Both are strong in {name}.",
     "In DISC theory, these two tendencies sit on opposite sides: one is outgoing and focuses on people and mood, the other is reserved and focuses on facts and accuracy.",
     "{name} may be very engaging on stage, yet extremely thorough when preparing.",
     "{name} may also be lively around people they know, yet very particular about details at work.",
     "When the two traits work well together, {name} can explain professional content in a lively way, so people both understand it and trust it."
    ],
    "good": [
     "Expression plus expertise: {name} can make professional content easy to follow and interesting.",
     "Creative and careful: {name}'s ideas are fresh, and they also hold up to checking.",
     "Works well with different types of people: {name} chats easily with enthusiastic people and can also go deep with people who value precision.",
     "Persuasion with a basis: Others find {name} interesting, and also credible."
    ],
    "comm": [
     "{name} explains things in a lively, interesting way and backs them up with evidence.",
     "{name} likes to share, but makes sure the content is correct first. When asked about details, {name} can usually answer.",
     "In unfamiliar settings {name} may be quieter, and only shows their lively side once they know people better."
    ],
    "commTip": "When discussing with {name}, give both ideas and data, since {name} values both. When giving feedback, start with what you appreciate, then point out specifically what could be adjusted.",
    "stress": [
     "Under pressure, {name} may over-prepare and revise again and again.",
     "{name}'s mood may also swing more: full of drive one moment, feeling not good enough the next.",
     "Behind these reactions is often that {name} wants to be both impressive and correct."
    ]
   },
   "CH": {
    "name": "Chameleon",
    "code": "Balanced",
    "one": "{name} can switch between different styles depending on the situation, and finds a suitable way to act wherever they are.",
    "core": [
     "In this response, {name}'s four tendencies are very close, with no single one standing out.",
     "This may mean {name} can adjust to the situation and the people involved: decisive when a decision is needed, enthusiastic when the mood needs lifting, patient when others need support, and careful when precision is needed.",
     "It may be hard to describe {name} in one word: coworkers see {name} as organized, friends find {name} easy to talk to, and family sees {name} as reliable.",
     "Not having a single label does not mean {name} lacks personality. {name} just tends to look at the situation first and then choose the most suitable approach."
    ],
    "good": [
     "Adaptable: {name} can find a suitable approach in many different environments.",
     "Understands different people: {name} can easily see things from other people's point of view.",
     "A natural bridge: {name} can help people with different styles communicate and work things out.",
     "Calm in the face of change: When things change, {name} can switch to another approach and keep going."
    ],
    "comm": [
     "{name} adjusts how they speak to the person: getting to the point with direct people, chatting casually with enthusiastic people, slowing down with people who need time, and discussing information with people who value evidence.",
     "{name} can communicate with most people and is often the one others come to for advice."
    ],
    "commTip": "To find out what {name} really thinks, ask directly: \"If it were up to you, what would you do?\" Don't guess only from how {name} goes along with others.",
    "stress": [
     "Under pressure, {name} may be unsure how to respond and go back and forth between several approaches.",
     "{name} may also go along too much with what others expect and forget their own needs.",
     "Behind these reactions is often the habit of thinking of everyone."
    ]
   }
  },
  "GAP": {
   "up": {
    "title": "A side of you that you may not notice",
    "D": [
     "People see you as decisive and direct, more than you think you are. With them, you may often be the one who decides first and pushes things forward.",
     "What made you think I am decisive?"
    ],
    "I": [
     "People see you as enthusiastic and easy to talk to, more than you think you are. You may be especially relaxed when you are with them.",
     "When is it liveliest when you are with me?"
    ],
    "S": [
     "People see you as steady and considerate, more than you think you are. The care that feels ordinary to you may be something others remember.",
     "What have I done that made you feel looked after?"
    ],
    "C": [
     "People see you as careful and precise, more than you think you are. Your habit of double-checking does not go unnoticed.",
     "What made you think I am careful?"
    ]
   },
   "down": {
    "title": "A side that people see less",
    "D": [
     "You see yourself as decisive and direct, but people feel it less. Perhaps you use your decisiveness mostly on your own matters.",
     "Do you think I make decisions quickly?"
    ],
    "I": [
     "You see yourself as enthusiastic and easy to talk to, but people feel it less. Perhaps your enthusiasm shows up mostly in familiar settings.",
     "Do you think I am easy to talk to?"
    ],
    "S": [
     "You see yourself as steady and considerate, but people feel it less. Perhaps your care stays mostly inside, or is shown in ways others don't notice.",
     "Do you think I am someone you can rely on?"
    ],
    "C": [
     "You see yourself as careful and precise, but people feel it less. Perhaps your care and checking mostly happen where others can't see.",
     "Do you think I work carefully?"
    ]
   },
   "same": "The way people see you is very close to how you described yourself. How you see yourself is about how others see you too."
  },
  "SECT": {
   "core": "{name}'s core traits",
   "good": "{name}'s strengths",
   "comm": "How {name} communicates",
   "commTipTitle": "Tips for communicating with {name}",
   "stress": "{name} under pressure"
  },
  "FEATURE": {
   "D": "decisive and direct",
   "I": "enthusiastic and easy to talk to",
   "S": "steady and considerate",
   "C": "careful and precise"
  }
 }
};
