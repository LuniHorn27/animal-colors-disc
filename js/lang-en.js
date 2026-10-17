/* 英文版文字（What's Your Inner Animal?）。結構和 index.html 的 ZH 字典相同，選英文時才載入。
   改這個檔案時，同時更新 js/lang-en.src.json 裡對應的中文原文（由 翻譯草稿/build_lang_en.py 產生）。 */
window.DISC_LANG_EN = {
 "code": "en",
 "htmlLang": "en",
 "locale": "en-GB",
 "dateOpts": {
  "day": "numeric",
  "month": "short",
  "year": "numeric"
 },
 "lblSep": "-",
 "labelSep": ": ",
 "labelMax": 40,
 "colon": ":",
 "colonGap": " ",
 "listSep": ", ",
 "metaSep": "   ",
 "animal": {
  "D": "Tiger",
  "I": "Peacock",
  "S": "Koala",
  "C": "Owl"
 },
 "ui": {
  "site.title": "What's Your Inner Animal? | DISC Behavioral Style Test",
  "site.desc": "Everyone has a Tiger, a Peacock, a Koala, and an Owl inside, just in different amounts. 46 questions, about 5–10 minutes, to find your inner animal.",
  "bar.brand": "What's Your Inner Animal?",
  "bar.nav": "Site navigation",
  "bar.qmode": "Show all questions",
  "bar.theme": "Dark mode",
  "bar.share": "Share the test",
  "bar.lang.short": "中",
  "bar.lang": "Switch to Chinese 中文",
  "lang.fail": "English is unavailable right now. Showing Chinese.／英文版暫時無法使用，先顯示中文。",
  "home.h1": "What's Your Inner Animal?",
  "home.intro": "This test is based on the DISC theory introduced by psychologist William Marston in 1928. It divides behavioral styles into four tendencies, each represented by an animal.",
  "home.tcode.D": "D Dominance",
  "home.tcode.I": "I Influence",
  "home.tcode.S": "S Steadiness",
  "home.tcode.C": "C Conscientiousness",
  "home.p1": "Everyone has all four animals inside, just in different amounts. No type is better than another; each has its own strengths and blind spots.",
  "home.p2": "46 questions, about 5–10 minutes. Go with your instinct and choose what fits you best, not how you wish you were.",
  "home.p3": "When you finish, you'll get a free personal report, including your inner animal, charts of your four tendencies, and suggestions for communication and careers.",
  "home.note": "Note: The result is for reference only and is not a score of your abilities. Your answers will be saved to help improve the test and the system, and will not be used for any other purpose. ",
  "home.see": "See our ",
  "home.privacy": "Privacy Policy",
  "home.end": ".",
  "home.consent": "I understand the result is for reference only, and I agree to have my answers saved.",
  "home.start": "Start the test",
  "home.resume": "Continue where I left off",
  "home.viewResult": "View my result",
  "home.myResults": "My past results",
  "class.ok": "Class: {name}",
  "class.notOpen": "This activity hasn't started yet. Please wait until your teacher tells you to begin.",
  "class.closed": "This activity has ended. If you still need to take the test, please check with your teacher.",
  "class.bad": "There is a problem with this activity link. Please check with your teacher.",
  "rd.title": "Start over?",
  "rd.progress": "You've already answered {n} questions. Starting over will erase these answers and begin again from question 1. This can't be undone.",
  "rd.progress.one": "You've already answered 1 question. Starting over will erase this answer and begin again from question 1. This can't be undone.",
  "rd.result": "Starting over will erase the result saved in this browser. This can't be undone. If you want to keep it, go to \"View my result\" first and save the result image.",
  "quiz.count": "Question {n} of {total}",
  "quiz.countList": "{n} of {total} answered",
  "quiz.hint": "Go with your first instinct",
  "quiz.pct": "{p}% done",
  "quiz.time": "Time {t}",
  "quiz.optsAria": "How well this describes you",
  "quiz.prev": "Previous",
  "quiz.kbd": "You can also answer with number keys 1–5",
  "quiz.next": "Next",
  "quiz.demo": "Demo: fill in automatically (for testing)",
  "quiz.missToast": "Question {n} hasn't been answered yet.",
  "quiz.qn": "Question {n}",
  "quiz.miss": "Not answered",
  "quiz.err": "{n} questions haven't been answered yet. We've taken you to question {q}.",
  "quiz.err.one": "1 question hasn't been answered yet. We've taken you to question {q}.",
  "blind.h": "Go with your instinct: pick the description that sounds most like you",
  "info.h": "About you",
  "info.name": "Name",
  "info.nameReq": "Name (required)",
  "info.emailHint": "If you fill this in, your result will be sent to this email address.",
  "info.age": "Age group",
  "info.gender": "Gender",
  "info.edu": "Education",
  "info.job": "Occupation",
  "info.choose": "Please select",
  "fu.legend": "Want to learn more about yourself?",
  "fu.want": "I'd like to learn more about career directions that suit me, or have a consultant explain my result in more depth.",
  "fu.more": "If you're interested, please leave your contact information.",
  "fu.phone": "Phone",
  "err.email": "This email address looks incomplete. Example: name@example.com. You can also leave it blank.",
  "err.name": "Please enter your name so your teacher can match the result to you.",
  "err.phone": "This phone number looks incomplete. Example: 0912-345-678. You can also leave it blank.",
  "err.line": "A LINE ID has 4–20 letters, numbers, or . _ -. You can find it in your LINE profile. You can also leave it blank.",
  "info.next": "See my result",
  "info.sending": "Sending your answers…",
  "info.wait": "This usually takes just a few seconds. Please don't close this page.",
  "hd.title": "Go back to the home page?",
  "hd.progress": "Your progress is saved in this browser. Later, you can choose \"Continue where I left off\" on the home page to pick up where you stopped.",
  "hd.progressStay": "Keep going",
  "hd.result": "Your result is saved in this browser. Later, you can choose \"View my result\" on the home page to open it again. If you take the test again, this result will be replaced by the new one.",
  "hd.resultStay": "Stay on this page",
  "nav.home": "Back to home",
  "chart.up": "Proactive",
  "chart.down": "Accommodating",
  "chart.left": "Task-focused",
  "chart.right": "People-focused",
  "chart.aria": "DISC four-direction chart: {list}. Your average: {avg}",
  "score.item": "{lbl} {n}",
  "vs.cham": "Your four scores are all very close. No animal stands out or is shown much less, so you can switch between styles depending on the situation.",
  "vs.dash": "The dashed line is the average of your four animals ({avg}). It's used to compare which are higher or lower.",
  "vs.habit": "Whether your average is high or low doesn't reflect ability, or good or bad. It depends on how you tend to answer (for example, if you often choose \"Very true of me,\" your average will be higher).",
  "vs.above": "<b>Above average</b>: {list}. Closer to your behavioral style; shown naturally, without effort.",
  "vs.equal": "<b>At average</b>: {list}. Shown now and then, but not your main style.",
  "vs.below": "<b>Below average</b>: {list}. Styles you show less often. It's not that you can't; it just takes more effort.",
  "donut.n2": "The bigger the share, the more that animal shows in you.",
  "donut.single": "{lbl} has the biggest share, so it is your inner animal.",
  "donut.two": "{a} and {b} have the biggest shares and are very close, so both are your inner animals.",
  "donut.cham": "All four animals have very similar shares, so you are a Chameleon.",
  "res.chamShort": "Chameleon",
  "res.plusShort": " + ",
  "res.plusMark": "+",
  "res.plusTitle": " + ",
  "res.cham": "Chameleon (Balanced)",
  "res.tfull": "{lbl}",
  "sub.combo": "{ab} Blend",
  "sub.diag": "{ab} Opposite Pair",
  "prom.high": "Of your four animals, {a} stands out the most, clearly above the others.",
  "prom.mid": "Of your four animals, {a} stands out the most, and {b} also plays a part.",
  "prom.low": "Of your four animals, {a} is only slightly ahead of {b}, and both show clearly.",
  "donut.center": "Your inner animal",
  "donut.aria": "Animal mix: {list}",
  "pct.item": "{lbl} {n}%",
  "bars.aria": "{list}. Maximum 100. Your average: {avg}",
  "avg.short": "Your average {avg}",
  "fold.more": ", and more ({n} topics)",
  "fold.title": "Detailed analysis",
  "fold.open": "Tap to see the full analysis",
  "fold.close": "Hide the analysis",
  "sec.core": "Core traits",
  "sec.good": "Your strengths",
  "sec.blind": "Possible blind spots",
  "sec.tension": "The pull between two traits",
  "sec.comm": "How you communicate",
  "sec.commTip": "For the people around you",
  "sec.stress": "You under pressure",
  "sec.stressTip": "A small tip",
  "sec.env": "Work environments and directions that suit you",
  "sec.jobs": "Possible directions (for reference only)",
  "sec.tips": "Tips for getting along with other animals",
  "sec.note": "About this result",
  "disclaimer": "The content above is for self-understanding only and is not a score of your abilities.",
  "meta.n": "{n} questions answered",
  "meta.time": "Time taken: {d}",
  "meta.date": "Completed on {date}",
  "dur.ms": "{m} min {s} s",
  "dur.s": "{s} s",
  "sync.sending": "Sending your answers…",
  "sync.sent": "Your answers have been sent. Thank you for taking part.",
  "sync.pending": "Your answers haven't been sent yet (the connection may be unstable). Your result is not affected. They will be sent automatically when you refresh or next open this page.",
  "sync.rejected": "Your answers couldn't be sent, but your result is not affected.",
  "sync.banner": "Your answers haven't been sent yet. The page will keep trying. Please don't close this page for now.",
  "sync.bannerSent": "Your answers have been sent. Thank you.",
  "sync.retry": "Send again",
  "sync.retrying": "Sending…",
  "warn.mid": "You chose \"Neutral\" for most questions, so this result is less reliable. For a more accurate result, you can take the test again and try to choose \"Somewhat true of me\" or \"Somewhat untrue of me.\"",
  "warn.fast": "You answered quite quickly this time, or chose the same answer many times in a row, so the result may not be accurate.",
  "again": "Start over",
  "again.confirm": "Starting over will erase this result, and it can't be undone. We suggest saving a result image first.",
  "again.keep": "Keep my result",
  "again.ok": "Erase and start over",
  "share.btn": "Share image",
  "rate.1": "Not at all",
  "rate.2": "Not really",
  "rate.3": "In between",
  "rate.4": "Somewhat",
  "rate.5": "Very much",
  "rate.h": "Does this analysis sound like you?",
  "rate.p": "Tap one to help make the test more accurate.",
  "rate.thanks": "Thanks for your feedback!",
  "res.eyebrow": "Your inner animal",
  "res.none": "Not enough to tell yet",
  "res.noneOne": "Your scores on all four tendencies are exactly the same, so we can't tell which one stands out. We suggest taking the test again and answering based on how you usually are.",
  "res.tentative": " (tentative)",
  "res.secondary": "Secondary: {lbl}. {sub}",
  "seg.aria": "How to show the result",
  "seg.brand": "Inner animal",
  "seg.data": "Exact data",
  "card.donut": "Your animal mix",
  "card.patbars": "Your four animal scores",
  "card.chart": "DISC four-direction chart",
  "card.bars": "Scores for the four types",
  "chart.legend": "The dashed circle is your average ({avg}). A dot outside it means that type shows more; a dot inside means it shows less.",
  "share.h": "Share your result",
  "share.p": "Create an image of your result with the full analysis, to download or share with friends.",
  "share.make": "Create result image",
  "share.alt": "Image of my inner animal result",
  "share.download": "Download image",
  "share.fileDefault": "inner-animal-result.png",
  "share.hold": "On a phone, press and hold the image to save it.",
  "invite": "Invite friends to take the test",
  "share.dock": "Save / share result image",
  "img.brand": "What's Your Inner Animal?",
  "img.brandSub": "DISC Behavioral Style Test",
  "img.dash": "The dashed line is the average of your four animals ({avg}).",
  "img.above": "Above average (closer to your style): ",
  "img.equal": "At average: ",
  "img.below": "Below average (shown less often): ",
  "img.legend": "Dashed circle: your average ({avg})   Dots outside show more",
  "img.bullet": "• ",
  "img.ask1": "What's your inner animal?",
  "img.ask2": "Take the test too",
  "img.scan": "Scan the QR code or go to:",
  "img.askOne": "What's your inner animal? Take the test too",
  "img.file": "inner-animal-{code}.png",
  "inapp.open": "Open in browser",
  "inapp.how": "Tap \"⋯\" in the top-right corner and choose to open the page in your browser.",
  "inapp.home": "You are using the built-in browser in {app}, so you may not be able to download or share images after the test. We suggest opening this page in your phone's browser (such as Chrome or Safari) before you start.",
  "inapp.result": "You are using the built-in browser in {app}, so you may not be able to download or share images. You can take a screenshot to save your result. If you switch to a browser, you will need to take the test again.",
  "test.shareText": "What's Your Inner Animal? A DISC behavioral style test. In about 5–10 minutes, find out which animals you are!",
  "test.inviteText": "I just found out my inner animal! It takes about 5–10 minutes. Take the test and see which animals you are!",
  "test.shareTitle": "What's Your Inner Animal? | DISC Behavioral Style Test",
  "test.copied": "Test link copied. You can paste it to your friends.",
  "test.copyThis": "Please copy this link and send it to your friends: {url}",
  "share.making": "Creating image…",
  "share.link": "\nTake the test too: {url}",
  "share.title": "My inner animal",
  "share.text": "My inner animal is \"{label}.\" What's yours?",
  "share.copied": "Result image copied. You can paste it into LINE, Messenger, or other chats to send to friends.",
  "share.unsupported": "This browser doesn't support direct sharing. Please download the image first, then send it to your friends.",
  "view.past": "This is your result from {date}.",
  "view.back": "Back to my past results",
  "save.done": "Saved to your account",
  "save.who": "Signed in as: {email}",
  "save.goHistory": "View my past results",
  "signout": "Sign out",
  "save.blocked": "Google doesn't allow signing in from the built-in browser in {app}. Please open this page in your phone's browser (such as Chrome or Safari) and sign in there.",
  "save.h": "Want to keep this result?",
  "save.p": "Sign in with your Google account to save this result. You'll still be able to see it if you change phones or come back later.",
  "save.signin": "Sign in with Google",
  "save.going": "Going to Google sign-in…",
  "save.fail": "Couldn't connect to the sign-in service. Please check your connection and try again.",
  "save.cancelled": "Sign-in didn't finish. If you'd like, choose \"Sign in with Google\" again.",
  "hist.h": "My past results",
  "hist.loading": "Loading…",
  "hist.fail": "Couldn't load your results. Please check your connection, go back to the home page, and choose \"My past results\" again.",
  "hist.empty": "There are no saved results in this account yet. After you finish the test, choose \"Sign in with Google\" on the result page, and your result will be saved here.",
  "hist.count": "{n} results. Tap one to open it.",
  "hist.count.one": "1 result. Tap it to open it.",
  "hist.del": "Delete",
  "hist.delAria": "Delete the result from {date}",
  "hist.delAsk": "Are you sure you want to delete the result from {date}? This can't be undone.",
  "hist.keep": "Keep",
  "hist.delOk": "Delete",
  "hist.deleting": "Deleting…",
  "hist.deleted": "Result deleted. {n} results left. Tap one to open it.",
  "hist.deleted.one": "Result deleted. 1 result left. Tap it to open it.",
  "hist.deletedNone": "Result deleted. There are no saved results in this account now.",
  "hist.delFail": "The deletion didn't finish. Please check your connection and choose \"Delete\" again.",
  "delall.h": "Delete my data",
  "delall.p": "Delete all results saved in this account, including the name and email you entered when taking the test. This can't be undone.",
  "delall.ask": "Are you sure you want to delete all saved results? This can't be undone.",
  "delall.keep": "Keep my data",
  "delall.done": "{n} results deleted. If you also want to delete the account itself, please email {email}.",
  "delall.done.one": "1 result deleted. If you also want to delete the account itself, please email {email}.",
  "delall.fail": "The deletion didn't finish. Please check your connection and try again."
 },
 "opts": {
  "14 歲以下": "14 or younger",
  "15–19 歲": "15–19",
  "20–24 歲": "20–24",
  "25–29 歲": "25–29",
  "30–34 歲": "30–34",
  "35–39 歲": "35–39",
  "40–44 歲": "40–44",
  "45–49 歲": "45–49",
  "50–54 歲": "50–54",
  "55–59 歲": "55–59",
  "60–64 歲": "60–64",
  "65 歲以上": "65 or older",
  "生理男": "Male",
  "生理女": "Female",
  "國中以下": "Junior high or below",
  "高中職": "Senior high or vocational high",
  "專科": "Junior college",
  "大學": "Bachelor's",
  "碩士": "Master's",
  "博士": "Doctorate",
  "學生": "Student",
  "上班族": "Office worker",
  "自由工作者": "Freelancer",
  "自營或創業": "Self-employed or business owner",
  "家管": "Homemaker",
  "待業中": "Looking for work",
  "退休": "Retired",
  "其他": "Other"
 },
 "items": {
  "D01": "When no one in a group takes the lead, I take the initiative to step up and lead everyone.",
  "D02": "I like to be in control of how things are done.",
  "D03": "When working in a group, I am often the one who divides up the tasks.",
  "D04": "I prefer making my own decisions rather than following other people's decisions.",
  "D05": "Even when I don't have all the information, I can make decisions quickly.",
  "D06": "As soon as I decide on a goal, I start working on it right away.",
  "D07": "When things are moving too slowly, I find ways to move them forward.",
  "D08": "I care more about the final result than about the process.",
  "D09": "The harder the task, the more motivated I feel to take it on.",
  "D10": "When there is competition, I really want to win.",
  "D11": "When I run into an obstacle, I try to push through it rather than go around it.",
  "D12": "If there is a chance of a better result, I am willing to take risks.",
  "D13": "I say what I think directly, even if the other person may not want to hear it.",
  "D14": "When I disagree with someone, I bring it up face to face and discuss it.",
  "D15": "When I speak, I usually get straight to the point.",
  "D16": "If I don't want to do something, I say no directly.",
  "I01": "I easily get to know people I have just met.",
  "I02": "At parties or events, I take the initiative to chat with different people.",
  "I03": "I often take the initiative to get people together to do things or join activities.",
  "I04": "I enjoy meeting new people.",
  "I05": "I can often persuade other people.",
  "I06": "My enthusiasm often spreads to the people around me.",
  "I07": "When I share ideas, I often use stories or examples to make others more interested.",
  "I08": "People are often willing to try new things because I encourage them.",
  "I09": "When something happens, I usually focus on the positive side.",
  "I10": "I often make the people around me laugh.",
  "I11": "When I have a new plan, I often feel excited and look forward to it.",
  "I12": "I like to be spontaneous and do things as soon as they come to mind.",
  "I13": "I like sharing ideas or stories in front of a group.",
  "I14": "I feel comfortable when everyone's attention is on me.",
  "I15": "When I speak, I use a lot of facial expressions and gestures.",
  "I16": "When chatting with others, I am usually the one who talks more.",
  "S01": "I like to do things well at my own steady pace.",
  "S02": "I prefer doing things in ways I am familiar with.",
  "S03": "I prefer plans made in advance rather than last-minute changes.",
  "S04": "Even when things move slowly, I can wait patiently.",
  "S05": "I am happy to help others, even when it is not my job.",
  "S06": "I value cooperation more than competition.",
  "S07": "I prefer supporting everyone from behind the scenes rather than being out in front.",
  "S08": "I place great value on long-term, stable working relationships.",
  "S09": "When my friends have something on their mind, they often come to me to talk.",
  "S10": "I often pay attention to what the people around me need.",
  "S11": "When others are talking, I usually listen patiently until they finish.",
  "S12": "People usually feel at ease around me.",
  "S13": "To keep things friendly, I often keep my different opinions to myself.",
  "S14": "I don't want people to think I am too pushy.",
  "S15": "To help everyone get along, I often go along with how others want to do things.",
  "S16": "When people ask for my opinion, I often say, \"Anything is fine with me.\"",
  "C01": "When I do something, I try to make it as perfect as possible.",
  "C02": "Before I hand in my work, I check it several times.",
  "C03": "I often notice details that others easily miss.",
  "C04": "For me, doing things correctly is more important than doing them quickly.",
  "C05": "I usually follow set procedures when I do things.",
  "C06": "I usually do things in order, finishing them one step at a time.",
  "C07": "I like to keep my things neat and well organized.",
  "C08": "I feel more at ease when there are clear rules to follow.",
  "C09": "Before making a decision, I do enough research first.",
  "C10": "I trust data and evidence more than feelings.",
  "C11": "When I hear a piece of news, I first check whether it is true.",
  "C12": "I like to understand the full story behind things.",
  "C13": "When I do something, I am extra careful to avoid mistakes.",
  "C14": "When I speak, I pay close attention to using precise words.",
  "C15": "Before I act, I first assess the possible risks.",
  "C16": "When things are uncertain, I prefer to be cautious."
 },
 "pairs": {
  "R01": "When I speak, I usually lead up to my main point gently instead of saying it right away.",
  "R02": "It usually takes me a long time to get to know people I have just met.",
  "R03": "I prefer acting on sudden ideas rather than following plans made in advance.",
  "R04": "I often do things in no particular order, just as they come to mind."
 },
 "attn": {
  "Q01": "For this question, please choose \"Somewhat true of me.\"",
  "Q02": "For this question, please choose \"Very untrue of me.\""
 },
 "scale": [
  "Very untrue of me",
  "Somewhat untrue of me",
  "Neutral",
  "Somewhat true of me",
  "Very true of me"
 ],
 "scaleL": [
  [
   "Very",
   "untrue of me"
  ],
  [
   "Somewhat",
   "untrue of me"
  ],
  [
   "Neutral"
  ],
  [
   "Somewhat",
   "true of me"
  ],
  [
   "Very",
   "true of me"
  ]
 ],
 "blind": {
  "D": [
   "I focus on results and efficiency, and I find ways to push through difficulties.",
   "I usually make my own decisions, speak directly, and enjoy challenging tasks."
  ],
  "I": [
   "I enjoy being around people, and I can easily start chatting with people I don't know well.",
   "I am optimistic and lively when I speak, and I am often the one who lifts the mood and encourages everyone."
  ],
  "S": [
   "I value harmony and stability, and I like to do things well at my own pace.",
   "I am a good listener and willing to go along with others, and my friends see me as someone they can rely on."
  ],
  "C": [
   "I value accuracy and quality, and I gather information before making decisions.",
   "I am organized, pay attention to detail, and like environments with clear standards."
  ]
 },
 "R": {
  "D": {
   "name": "Tiger",
   "code": "D Dominance",
   "one": "Once you see a goal, you act on it and lead others to move things forward.",
   "core": [
    "You care about results and efficiency. When a problem comes up, your first thought is usually \"How can I solve this?\" rather than \"Oh no, what now?\"",
    "You are willing to make decisions and to take responsibility for them.",
    "For you, difficulties are not a reason to back down. They are challenges worth taking on.",
    "You do your best when you can see progress and set your own direction.",
    "What tires you most is when things get stuck, or when the decision is not in your hands.",
    "Others sometimes think you are too direct, but your directness comes from wanting to make things better. It is not aimed at anyone."
   ],
   "good": [
    "Quick decisions: Even without complete information, you can choose a direction and get things moving.",
    "Ready for challenges: The harder the task, the more committed you become.",
    "Clear goals: When a discussion loses focus, you can bring everyone back to what really matters.",
    "Honest: When a problem comes up, you point it out directly instead of letting it drag on."
   ],
   "blind": [
    "When you are in a hurry, you may miss details or overlook how the people around you feel.",
    "Your directness is meant to solve problems, but the other person may first feel pressured or rejected.",
    "Because you are used to setting the direction yourself, it can be hard to let others do things their own way.",
    "You get anxious when progress slows down, and that urgency can make others even more nervous."
   ],
   "comm": [
    "You usually start with the conclusion and prefer short, focused conversations.",
    "You appreciate people who say what they think directly, because it is the most efficient way.",
    "Vague or roundabout statements can leave you unsure what the other person really means."
   ],
   "commTip": "When talking with Tiger types, start with the main point and the conclusion, then add the details. If you disagree, say so directly and give your reasons. They will take it seriously.",
   "stress": [
    "Under pressure, you may become more forceful and impatient, and try to carry everything on your own.",
    "You may also start giving orders to push things forward.",
    "Behind these reactions is often a strong wish to do things well and keep them from getting out of control."
   ],
   "stressTip": "Before you make a decision, ask, \"What does everyone think?\" Spending one more minute listening can often save much more time later.",
   "env": [
    "Clear goals and visible, concrete results",
    "Room to make decisions and work independently",
    "A fast pace and real challenges, with new problems to solve"
   ],
   "jobs": "Starting a business, management, project lead, business development, operations manager, crisis management",
   "tips": [
    "With Peacock types: They value interaction and recognition. A word of appreciation will motivate them more.",
    "With Koala types: They need time to adjust to change. Tell them about big changes as early as you can.",
    "With Owl types: They care about accuracy. Give them enough information and time to think, and don't rush them for an answer."
   ]
  },
  "I": {
   "name": "Peacock",
   "code": "I Influence",
   "one": "Your enthusiasm and way with words energize the people around you and bring things to life.",
   "core": [
    "You believe things will turn out well, and you believe in people.",
    "You enjoy being with people. Your enthusiasm and stories move others and make them want to take part.",
    "In a group, you are often the one who lifts the mood and helps strangers get to know each other quickly.",
    "You do your best when you are seen and appreciated, and when you work with a group of energetic people.",
    "What tires you most is working alone for a long time on repetitive tasks with little interaction.",
    "Your enthusiasm is genuine. Because you care about people, how others react often affects your mood."
   ],
   "good": [
    "Inspiring: Your enthusiasm can help everyone get their energy back.",
    "Expressive: You can explain ideas in a vivid, concrete way that people want to listen to.",
    "Well connected: You easily build relationships with people from different backgrounds.",
    "Positive and flexible: When things change, you quickly see new possibilities."
   ],
   "blind": [
    "You have many ideas and start quickly, but finishing up and handling the details can get put aside.",
    "Because you don't want to let people down, you sometimes agree to too much and run out of time.",
    "Relationships matter a lot to you, so being ignored or rejected can easily affect your mood.",
    "You tend to trust your instincts when making decisions and may skip some of the checking."
   ],
   "comm": [
    "You speak in a lively, expressive way and enjoy relaxed, back-and-forth conversations.",
    "You are happy to share your ideas and experiences.",
    "You are moved more by real stories and people than by cold numbers."
   ],
   "commTip": "When talking with Peacock types, start by creating a relaxed atmosphere and give them room to express themselves. Afterward, confirm important details and deadlines in writing to be safe.",
   "stress": [
    "Under pressure, your emotions may go up and down more, and you may talk faster.",
    "To avoid unpleasant situations, you may put off things that need to be dealt with.",
    "Behind these reactions is often a wish to keep the mood good and not let anyone down."
   ],
   "stressTip": "Write down the important things and put them in order of priority. Before you say yes to someone, check whether you really have the time.",
   "env": [
    "Working and collaborating with people",
    "An open atmosphere where you can freely share ideas",
    "Varied work that doesn't stay the same"
   ],
   "jobs": "Marketing, public relations, sales, event planning, trainer or speaker, host or presenter, customer relations",
   "tips": [
    "With Tiger types: They value efficiency. Start with the main point in discussions and save the enthusiasm for later.",
    "With Koala types: They prefer a steady pace. Don't share too many new ideas at once, and give them time to take them in.",
    "With Owl types: They care about evidence. Prepare some concrete information when you share your ideas."
   ]
  },
  "S": {
   "name": "Koala",
   "code": "S Steadiness",
   "one": "Your steadiness and patience help the people around you feel at ease and know they can rely on you.",
   "core": [
    "You value harmony and stability. You like to do things well at your own pace in a familiar, friendly environment.",
    "You are a good listener. You often notice who needs help before others do, and you are willing to support them quietly in the background.",
    "For you, relationships built on trust matter more than winning against others.",
    "You do your best when you know you are needed and the team trusts one another.",
    "What tires you most is constant change and heated conflict.",
    "People often find you easy to get along with. In fact, you have strong opinions of your own; you just tend to look after everyone's feelings first."
   ],
   "good": [
    "Reliable: You consistently do what you agree to, so people feel safe handing things to you.",
    "Patient: You are willing to take the time to do things well and to wait for others.",
    "A good listener: People feel understood by you and comfortable around you.",
    "The glue of the team: You can ease tension and help people work together more smoothly."
   ],
   "blind": [
    "To avoid conflict, you often keep your different opinions to yourself at first.",
    "You find it hard to say no, so you may take on too much.",
    "When something changes suddenly, you need more time to adjust.",
    "Because you tend to go along with others first, you sometimes overlook your own needs."
   ],
   "comm": [
    "You speak gently and patiently, and you usually listen to others' ideas before sharing your own.",
    "When you are rushed or face a heated argument, you need a little time to sort out your thoughts before you can say what you really think."
   ],
   "commTip": "When talking with Koala types, slow down and give them time to think. If you want to know what they really think, ask them in private and in a relaxed way.",
   "stress": [
    "Under pressure, you may become quiet and withdrawn, and agree on the surface even when you don't agree inside.",
    "If the pressure builds up for a long time, it may all come out at once.",
    "Behind these reactions is often the habit of always thinking of others and putting your own feelings last."
   ],
   "stressTip": "Try saying \"I feel…\" out loud. Sharing your thoughts at the right time won't damage your relationships. It actually helps others understand you better.",
   "env": [
    "Stable and predictable, with clear roles",
    "A focus on teamwork and a friendly atmosphere",
    "Long-term relationships rather than constant competition"
   ],
   "jobs": "Administration, human resources, customer service, nursing, social work, education and counseling",
   "tips": [
    "With Tiger types: They speak directly, and it is not always about you. If you need time, tell them clearly how much.",
    "With Peacock types: They have many ideas and change quickly. You can help remind them to finish what they start.",
    "With Owl types: You both value stability, and they care even more about accuracy. Be specific when you give them feedback."
   ]
  },
  "C": {
   "name": "Owl",
   "code": "C Conscientiousness",
   "one": "You like to think things through and get them right before you hand them in.",
   "core": [
    "You value quality and accuracy.",
    "When you face a task, you first make sure you understand the standards, gather enough information, and check that the direction is right before you start.",
    "For you, doing it right matters more than doing it fast, because a mistake that goes unnoticed often takes much more effort to fix later.",
    "You do your best when there are clear standards and enough time and information.",
    "What tires you most is rules that keep changing, or being asked to decide without anything to base the decision on.",
    "Others sometimes see you as strict and calm. In fact, your strictness comes from caring: you care about the result, and you don't want anyone to lose out because of a careless mistake."
   ],
   "good": [
    "Precise: You notice mistakes and gaps that others miss, so your work holds up when checked.",
    "Strong at analysis: You judge things with logic and facts and are not easily swayed by emotions or opinions.",
    "Organized: You work step by step and stay consistent, so people feel safe giving you tasks.",
    "Aware of risks: Before acting, you think about what could go wrong and prevent losses early."
   ],
   "blind": [
    "Because you want things to be complete, you sometimes spend extra time on details and progress is slower than expected.",
    "When there is not enough information yet, you tend to check a bit more, so it is harder for you to decide quickly.",
    "You tend to point out problems first. You mean to help check things, but the other person may first feel rejected.",
    "You rarely share your feelings on your own, so the people around you are sometimes unsure what you think or how you feel."
   ],
   "comm": [
    "You speak precisely and with evidence, and you prefer logical discussions backed by information.",
    "When you hear something vague, you want to ask for clarification first. You are not doubting the other person; you want to make sure everyone understands the same thing."
   ],
   "commTip": "When talking with Owl types, give them concrete information and clear expectations, and give them time to think. If you disagree, discussing the facts works better than trying to persuade them with emotions.",
   "stress": [
    "Under pressure, you may become even more demanding about details, check things again and again, or not want to discuss things with others for a while.",
    "Worrying about making mistakes may also make you put off decisions again and again.",
    "Behind these reactions is often how much you care about doing things well."
   ],
   "stressTip": "First set a \"good enough\" standard for the task, and once you reach it, call it done for now. Not everything needs to be perfect.",
   "env": [
    "Clear standards, processes, and quality requirements",
    "Being able to focus without constant interruptions",
    "A place that values expertise and accuracy"
   ],
   "jobs": "Engineer, researcher, data analyst, accountant, quality management, legal work, auditing",
   "tips": [
    "With Tiger types: They value efficiency. Give them the conclusion and your judgment first, and add the details later.",
    "With Peacock types: They care about feelings. Before pointing out a problem, recognize what they did well.",
    "With Koala types: They don't like conflict. When you share your opinion, use a softer tone."
   ]
  },
  "DI": {
   "name": "Tiger + Peacock",
   "code": "DI Blend",
   "one": "You have both drive and charisma, and you can lead everyone toward a goal together.",
   "core": [
    "You have both the Tiger's decisiveness and the Peacock's enthusiasm, and the two are about equally strong in you.",
    "When you see an opportunity, you want to act right away, and you naturally bring the people around you along.",
    "Rather than working hard alone, you are used to standing in front and leading a group forward.",
    "Your Tiger side makes you willing to decide and take responsibility; your Peacock side helps you inspire people.",
    "You move things forward not only by giving instructions, but also by sharing a vision and enthusiasm that make people want to follow.",
    "New and challenging things get you most involved. Work that never changes can easily make you lose motivation."
   ],
   "good": [
    "Can lead and can push: You can make decisions and also motivate everyone to act together.",
    "Good at starting new things: When a new opportunity comes up, you act quickly and find people who will support you.",
    "Persuasive: You speak with confidence and warmth, so people want to believe you.",
    "Quick to respond: When things change, you can change direction right away and keep everyone moving."
   ],
   "blind": [
    "You move fast, and the people around you may be pushed ahead before they have thought things through.",
    "You start many things at once, so following up and handling details can get put aside.",
    "Your confidence and enthusiasm can sometimes make quieter people afraid to disagree.",
    "Long discussions, processes, and rules can easily make you lose patience."
   ],
   "comm": [
    "You speak with enthusiasm, directness, and energy, and you like quick discussions and making decisions on the spot.",
    "You tend to talk about the vision and the big picture first, and going into details can feel slow to you.",
    "The more enthusiastic the other person's response, the more energized you feel."
   ],
   "commTip": "When talking with Tiger + Peacock types, keep up with their pace. Talk about goals and direction first, then add the details. If you disagree, say so directly. Afterward, confirm important deadlines and who does what in writing.",
   "stress": [
    "Under pressure, you may become more impatient and forceful, want to control everything yourself, or use persuasion and force of personality to override objections.",
    "You may also agree to even more things at once, leaving both you and your team overloaded.",
    "Behind these reactions is often how much you want things to succeed."
   ],
   "stressTip": "Find a careful partner to help you keep an eye on details and progress. Before you decide, deliberately take a moment to ask the quieter people what they think.",
   "env": [
    "Fast-changing, with new challenges and visible results",
    "Chances to lead a team, be out in front, and open up new areas",
    "Freedom to decide how to do things, without too many rules"
   ],
   "jobs": "Starting a business, sales manager, marketing manager, new business development, brand manager, leading events or projects",
   "tips": [
    "With Koala types: They need time to adjust to change. Slow down in discussions, and don't push them to agree on the spot.",
    "With Owl types: They care about evidence. When you suggest a new idea, have the information and concrete steps ready.",
    "With Tiger or Peacock types: You get along right away, but you may also overlook risks together. Remember to ask someone to check the details."
   ]
  },
  "IS": {
   "name": "Peacock + Koala",
   "code": "IS Blend",
   "one": "You are warm and understanding, and you make the people around you feel valued.",
   "core": [
    "You have both the Peacock's enthusiasm and the Koala's thoughtfulness, and the two are about equally strong in you.",
    "People matter to you. You enjoy being with others and care a lot about how they feel.",
    "You are good at building relationships and creating a warm atmosphere, and you are often the person on the team who helps others feel safe and comfortable.",
    "Your Peacock side helps you start conversations and make friends easily; your Koala side makes you willing to listen and stay by people's side for the long term.",
    "Your relationships are usually not only wide but also deep.",
    "For you, getting along well and trusting one another is the starting point for doing good work."
   ],
   "good": [
    "Well liked: People find you easy to approach and trust, and new acquaintances quickly feel close to you.",
    "Empathetic: You notice how others feel and what they need, and you show care at the right time.",
    "Good at bringing people together: When opinions differ, you can find a way everyone can accept.",
    "Creates a good atmosphere: You make working together relaxed, and new members can fit in easily."
   ],
   "blind": [
    "You find it hard to say no, so you often put up with things you don't want to do.",
    "You find it hard to give needed criticism or bad news, so problems may drag on longer.",
    "When making decisions, you can be swayed by feelings, or put off deciding because you worry about upsetting someone.",
    "Numbers, details, and strict rules can make you feel distant and unmotivated."
   ],
   "comm": [
    "You speak in a friendly, gentle way. You enjoy chatting and value two-way conversations.",
    "You usually ask how the other person is doing before getting down to business, and you pay attention to whether your words might make someone uncomfortable.",
    "When there is conflict, you tend to calm things down first rather than argue about who is right on the spot."
   ],
   "commTip": "When talking with Peacock + Koala types, ask how they are doing before getting down to business. If you need to criticize, do it privately and gently, and let them know what you appreciate too.",
   "stress": [
    "Under pressure, you may worry too much about what others think and keep putting up with things.",
    "When you feel down, you may not say anything and keep smiling on the outside. Over time, you may suddenly feel exhausted and want to get away from people for a while.",
    "Behind these reactions is often the habit of always taking care of others first."
   ],
   "stressTip": "Practice saying, \"I can't do it this time.\" Take care of yourself first, so you can keep taking care of others.",
   "env": [
    "People-centered, with a focus on cooperation and care",
    "A friendly, supportive atmosphere rather than fierce competition",
    "Long-term relationships, where you can see how you have helped others"
   ],
   "jobs": "Customer relations, human resources, education, counseling, social work, community management, retail service",
   "tips": [
    "With Tiger types: They speak directly, but that doesn't mean they don't care about you. Start with the main point in discussions, and say so directly when you need more time.",
    "With Owl types: They care about evidence. Prepare concrete details when you share an idea, and they will trust you more.",
    "With Peacock or Koala types: You get along well, but you may both avoid difficult conversations. Remember to bring problems up."
   ]
  },
  "SC": {
   "name": "Koala + Owl",
   "code": "SC Blend",
   "one": "You are steady, practical, careful, and reliable, someone people can count on to get things done.",
   "core": [
    "You have both the Koala's steadiness and the Owl's carefulness, and the two are about equally strong in you.",
    "You plan your work and go step by step. You care about quality and also about harmony in the team.",
    "You don't seek the spotlight, but everyone feels confident handing things to you.",
    "Your Koala side makes you patient and willing to work with the team; your Owl side makes you pay attention to detail and insist on getting things right.",
    "You are often the one on the team who quietly checks the work: you may not speak first, but you notice what others have missed and finish things step by step."
   ],
   "good": [
    "Steady and reliable: Your work is consistent in quality and rarely has mistakes.",
    "Careful and organized: You value processes and details, and you plan the steps before you start.",
    "Committed for the long term: You are willing to patiently do one thing well and keep at it.",
    "Trustworthy: You do what you say you will do, so people trust you."
   ],
   "blind": [
    "When something changes suddenly, you need more time to adjust.",
    "You rarely push for opportunities or show what you can do, so your hard work can be overlooked.",
    "You tend to make cautious decisions and may miss moments that call for quick action.",
    "You tend to keep different opinions to yourself, so others may not notice that you have doubts."
   ],
   "comm": [
    "You speak quietly and carefully, and you think things through before you speak.",
    "You like to know in advance what will be discussed. When you have time to prepare, your input is often very helpful.",
    "In large groups or tense situations, you usually observe first and rarely speak up on the spot."
   ],
   "commTip": "When talking with Koala + Owl types, tell them about changes in advance, with a clear explanation and time to prepare. If you want their opinion, give them the questions ahead of time or ask them in private.",
   "stress": [
    "Under pressure, you may become withdrawn and anxious, and hold on even more tightly to the way things were done before.",
    "You may also keep your worries to yourself, checking things again and again alone and working overtime to fix them.",
    "Behind these reactions is often a wish not to let anyone down."
   ],
   "stressTip": "When things change, first list \"what will stay the same.\" It will help you feel more settled. Also try to share your opinions on your own; your carefulness is exactly what the team needs.",
   "env": [
    "Stable, with clear processes and roles",
    "A focus on quality and expertise, with enough time to do things well",
    "A calm atmosphere, without having to keep competing or performing in front of others"
   ],
   "jobs": "Administrative management, accounting, quality management, data management, technical support, research assistant, civil service",
   "tips": [
    "With Tiger types: They value speed. Give the conclusion first, then explain your concerns and the time you need.",
    "With Peacock types: They have many ideas and change quickly. You can help turn their ideas into steps that can actually be carried out.",
    "With Koala or Owl types: You work together very steadily, but you may both avoid change. It's good to try a new approach once in a while."
   ]
  },
  "CD": {
   "name": "Owl + Tiger",
   "code": "CD Blend",
   "one": "You are logical and decisive, and you aim for results that are both fast and right.",
   "core": [
    "You have both the Owl's carefulness and the Tiger's decisiveness, and the two are about equally strong in you.",
    "You value facts and logic, and you also care about results.",
    "You have high standards for yourself and others. You are good at analyzing problems and pushing solutions forward.",
    "Your Owl side helps you think clearly and deeply; your Tiger side makes you willing to decide and take responsibility.",
    "You don't stop at analysis, and you don't act before thinking things through.",
    "When facing a complicated problem, you are often the one who calmly breaks it down and then says, \"Let's do it this way.\""
   ],
   "good": [
    "Thinks it through and gets it done: Once the analysis is done, you can move it into action.",
    "High standards: You expect quality, and your work holds up when checked.",
    "Objective: You focus on the facts and are not easily swayed by emotions or personal relationships.",
    "Solves complex problems: When facing a difficult problem, you calmly break it down and find what matters most."
   ],
   "blind": [
    "Because you speak directly and precisely, others may find you cold or harsh.",
    "When you focus on the problem itself, you may overlook the atmosphere and how others feel.",
    "You expect a lot from yourself and tend to judge others by the same standards, so you can be less patient with people who fall short.",
    "You trust your own judgment and sometimes find it hard to accept other people's ways of doing things."
   ],
   "comm": [
    "You speak briefly and logically. You point out problems directly and explain your reasons.",
    "You prefer discussions that are based on evidence and reach a conclusion, and you have little patience for meetings without a clear point.",
    "Your feedback is usually very specific, but you don't always think first about how it will feel to hear it."
   ],
   "commTip": "When talking with Owl + Tiger types, use data and logic, and bring up problems and solutions directly. You can disagree, but have your reasons ready.",
   "stress": [
    "Under pressure, you may become pickier and stricter, take on everything yourself, and not want to hand things to others.",
    "You may also raise your standards even higher, leaving both you and your team feeling overwhelmed.",
    "Behind these reactions is often a strong sense of responsibility for the result."
   ],
   "stressTip": "When you give feedback, add a word of recognition, and your team will be more willing to keep up with your standards. Also ask yourself, \"Do I really need to do this myself?\"",
   "env": [
    "A focus on expertise, standards, and results",
    "Room to make your own judgments and drive improvements",
    "People are judged by ability and performance, not by personal connections"
   ],
   "jobs": "Engineering manager, strategy analyst, finance, management consultant, technical expert, process improvement",
   "tips": [
    "With Peacock types: They care about feelings and interaction. Before pointing out a problem, recognize what they did well.",
    "With Koala types: They don't like conflict. When something needs to change, tell them early and use a softer tone.",
    "With Owl or Tiger types: You communicate very efficiently, but when you disagree, you can easily get stuck. Agree in advance on how you will make the decision."
   ]
  },
  "DS": {
   "name": "Tiger + Koala",
   "code": "DS Opposite Pair",
   "one": "You are firm yet caring, and you can find a balance between goals and people.",
   "core": [
    "You have two traits that point in opposite directions: the Tiger's decisiveness and focus on results, and the Koala's patience and focus on harmony. Both are strong in you.",
    "In DISC theory, these two tendencies sit on opposite sides: one pushes things forward, and the other steadily goes along with others.",
    "You may switch between them depending on the situation: decisive and driving at work, but easygoing with friends or family.",
    "You may also be very firm about your goals while taking care of everyone's feelings in how you reach them.",
    "When the two traits work well together, you can get things moving and also make people want to follow you."
   ],
   "good": [
    "Balances goals and people: You can push things forward without making people feel sacrificed.",
    "Firm but not harsh: You can hold your position and keep good relationships at the same time.",
    "Adjusts to the situation: Decisive when needed, accepting when needed.",
    "Trusted and followed: People know you have a direction, and they know you will look after them."
   ],
   "blind": [
    "You are usually easygoing, but once you have had enough, you turn firm. Others may feel you suddenly became a different person.",
    "Because you want to take care of both progress and every person, you can take on too much responsibility.",
    "You hold firmly to a direction once it is decided, so changing plans at the last minute is hard for you.",
    "You tend to carry things on your own and rarely let others know you are under pressure."
   ],
   "tension": [
    "You want to push things forward, but you worry about hurting people's feelings, so you may hesitate between the two.",
    "Others may see you as \"sometimes very forceful, sometimes very easygoing\" and find you hard to read.",
    "Switching between two roles for a long time can build up stress."
   ],
   "comm": [
    "You speak directly or gently depending on the situation: clear and direct about goals and decisions, slower and more attentive when people's feelings are involved.",
    "You are usually willing to hear everyone out first, but you often already have a direction in mind."
   ],
   "commTip": "To understand Tiger + Koala types, you can ask directly: \"Do you care more about the result here, or about how everyone feels?\" They will usually give you an honest answer.",
   "stress": [
    "Under pressure, you may swing between being forceful and giving in: one moment you want to decide everything yourself, the next you go along with everything.",
    "You may also keep the peace on the surface while growing more and more irritated inside.",
    "Behind these reactions is often a wish to take care of both the task and every person."
   ],
   "stressTip": "First figure out what matters most here, then decide whether to hold firm or go along. You can also let people around you know whether you want to \"push ahead\" or \"hear everyone out first,\" so they won't guess wrong.",
   "env": [
    "Roles that need to take care of both results and people",
    "Clear goals, with a stable team that trusts one another",
    "Leading the same group of people over the long term rather than constantly changing teams"
   ],
   "jobs": "Team leader, project coordinator, store manager, sports coach, care management, operations manager",
   "tips": [
    "With Peacock types: They have many ideas and move fast. You can help them turn their enthusiasm into concrete goals.",
    "With Owl types: They care about evidence. Before pushing for a decision, give them information and time to think.",
    "With Tiger or Koala types: You understand both, so when they disagree, you can help each side say what the other cares about."
   ],
   "note": [
    "An opposite pair means you scored high on two tendencies that point in opposite directions.",
    "If this doesn't sound like you, look at each animal's score in the charts above and think about which one is closer to your everyday self.",
    "You can also take the test again after some time."
   ]
  },
  "IC": {
   "name": "Peacock + Owl",
   "code": "IC Opposite Pair",
   "one": "You are enthusiastic yet careful, and you can make complicated things clear and interesting.",
   "core": [
    "You have two traits that point in opposite directions: the Peacock's outgoing enthusiasm and the Owl's precision and care. Both are strong in you.",
    "In DISC theory, these two tendencies sit on opposite sides: one is outgoing and focuses on people and atmosphere, and the other is reserved and focuses on facts and accuracy.",
    "You may be captivating on stage but extremely thorough when you prepare.",
    "You may also be lively with people you know well but very particular about details at work.",
    "When the two traits work well together, you can make expert content lively, so people both understand it and trust it."
   ],
   "good": [
    "Expression plus expertise: You can make expert content easy to understand and interesting.",
    "Both creative and careful: Your ideas are fresh, and they hold up when checked.",
    "Works well with all kinds of people: You get along with enthusiastic people and can go deep with precise ones.",
    "Persuasive with evidence: People find you both interesting and believable."
   ],
   "blind": [
    "Because you expect a lot of yourself, you may prepare for too long and miss the moment to share.",
    "You care both about how others see you and about getting things right, so you can be too hard on yourself.",
    "When you are excited, you have many ideas; when you calm down, you reject them one by one, and things stay where they are.",
    "Trying to take care of both people and details can use up too much energy and wear you out."
   ],
   "tension": [
    "You want to express yourself freely, but you worry it won't be perfect.",
    "You feel torn between \"share it now\" and \"check it once more.\"",
    "Others may find it hard to tell what your real style is."
   ],
   "comm": [
    "You explain things in a lively, interesting way and back them up with evidence.",
    "You like to share, but you make sure the content is correct first. When asked about details, you can usually answer.",
    "You may be quieter in unfamiliar settings and show your lively side once you get to know people."
   ],
   "commTip": "When discussing things with Peacock + Owl types, offer both ideas and information, because they value both. When giving feedback, start with what you appreciate, then point out specifically what could be adjusted.",
   "stress": [
    "Under pressure, you may over-prepare and keep revising.",
    "Your emotions may also go up and down more: full of energy one moment, feeling you haven't done enough the next.",
    "Behind these reactions is often a wish to be both impressive and correct."
   ],
   "stressTip": "Decide which situations need to be perfect and which only need to be finished. Give yourself a deadline for when \"this is where I hand it in.\"",
   "env": [
    "Roles that involve explaining expert content to others",
    "Room for creativity, along with a focus on quality and expertise",
    "Time to prepare well, and chances to present and share"
   ],
   "jobs": "Trainer or speaker, consultant, product manager, technical sales, educational content creator, user researcher",
   "tips": [
    "With Tiger types: They value speed. Give them the conclusion and your recommendation first, and add details when they ask.",
    "With Koala types: They like a steady pace. Share new ideas one at a time and give them time to take them in.",
    "With Peacock or Owl types: You understand both, so you can help enthusiastic people add evidence and help careful people explain their ideas more clearly."
   ],
   "note": [
    "An opposite pair means you scored high on two tendencies that point in opposite directions.",
    "If this doesn't sound like you, look at each animal's score in the charts above and think about which one is closer to your everyday self.",
    "You can also take the test again after some time."
   ]
  },
  "CH": {
   "name": "Chameleon",
   "code": "Balanced",
   "one": "You can switch between different styles depending on the situation, and you find a suitable way to act wherever you are.",
   "core": [
    "Your scores on the four tendencies are very close, with no single one standing out.",
    "This may mean you can adjust to the situation and the people involved: decisive when a decision is needed, enthusiastic when the mood needs lifting, patient when others need support, and careful when precision is needed.",
    "You may find it hard to describe yourself in one word: coworkers see you as organized, friends find you easy to talk to, and family sees you as reliable.",
    "Not having a single label doesn't mean you lack personality. You just tend to look at the situation first and then choose the most suitable approach."
   ],
   "good": [
    "Adaptable: You can find a suitable approach in many different environments.",
    "Understands different people: You can easily see things from other people's point of view.",
    "A natural bridge: You can help people with different styles communicate and work things out.",
    "Calm in the face of change: When things change, you can switch to another approach and keep going."
   ],
   "blind": [
    "Others may find it hard to see your core style and feel they don't really know you.",
    "Sometimes you aren't sure yourself which way you truly prefer.",
    "Always adjusting to your surroundings can wear you out over time.",
    "Since every approach seems fine, it can be harder to decide when you need to take a clear position."
   ],
   "comm": [
    "You adjust how you speak to the person: you get to the point with direct people, chat casually with enthusiastic people, slow down with people who need time, and discuss information with people who value evidence.",
    "You can communicate with most people and are often the one others come to for advice."
   ],
   "commTip": "To find out what a Chameleon really thinks, ask directly: \"If it were up to you, what would you do?\" Don't judge only by how they go along with others.",
   "stress": [
    "Under pressure, you may be unsure how to respond and go back and forth between several approaches.",
    "You may also go along too much with what others expect and forget your own needs.",
    "Behind these reactions is often the habit of thinking of everyone."
   ],
   "stressTip": "Once in a while, ask yourself: \"If I didn't have to fit in with anyone, what would be my most comfortable way of doing this?\"",
   "env": [
    "Environments that need cooperation across teams and many different roles",
    "Varied work, with contact with different people and tasks",
    "Situations where someone needs to find agreement among different opinions"
   ],
   "jobs": "Project coordinator, cross-team contact person, consultant, startup team member, operations management, event coordinator",
   "tips": [
    "With Tiger types: State your position directly, and they will respect you more.",
    "With Peacock types: You can match their enthusiasm, and you can also bring the conversation back to the main point when needed.",
    "With Koala types: Your flexibility helps them feel at ease. When things change, give them a little more time to prepare.",
    "With Owl types: They value consistency. Try not to change the standards and methods you've set too often."
   ],
   "note": [
    "Close scores on all four may mean you are truly very flexible.",
    "It may also be because you are going through a change in your life or work, or because you pictured different situations while answering (for example, thinking about work for some questions and home for others).",
    "You can look at which animal is slightly higher in the charts above, or take the test again after some time while picturing the same situation throughout."
   ]
  }
 },
 "SUB": {
  "DI": "Your decisiveness comes with enthusiasm. When you push things forward, you use persuasion and encouragement to bring people along, not just instructions.",
  "DS": "Your decisiveness comes with patience. You care about results, and you also consider how the team feels and are willing to wait so everyone moves forward together.",
  "DC": "Your decisiveness comes with care. You decide quickly, but you first get hold of the key information, aiming to be both fast and right.",
  "ID": "Your enthusiasm comes with drive. You don't just inspire people; you also take the lead in making things happen.",
  "IS": "Your enthusiasm comes with gentleness. Besides lifting the mood, you also care whether everyone feels comfortable.",
  "IC": "Your enthusiasm comes with attention to detail. When you share ideas, there is real substance behind them, so people find you both interesting and believable.",
  "SD": "Your steadiness comes with determination. You are usually easygoing, but you stand by your principles on things that matter.",
  "SI": "Your steadiness comes with friendliness. You are reliable, and you get along with people easily.",
  "SC": "Your steadiness comes with care. You work in a practical and careful way, and the tasks you are given rarely go wrong.",
  "CD": "Your carefulness comes with decisiveness. Once you finish your analysis, you move it into action instead of stopping at ideas.",
  "CI": "Your carefulness comes with a way with words. You can explain complicated analysis clearly and simply.",
  "CS": "Your carefulness comes with patience. You are willing to take the time to do things well, and you also consider how the people you work with feel."
 }
};
