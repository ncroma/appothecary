const MIND_AND_SLEEP = [
    "com.getsomeheadspace.android",
    "com.calm.android",
    "com.northcube.sleepcycle",
    "com.urbandroid.sleep",
    "meditofoundation.medito",
    "net.daylio",
    "com.clue.android"
];

const FITNESS_AND_HEALTH = [
    "com.myfitnesspal.android",
    "com.fitbit.FitbitMobile",
    "com.nike.ntc",
    "com.runtastic.android",
    "homeworkout.homeworkouts.noequipment",
    "com.google.android.apps.fitness",
    "com.sec.android.app.shealth",
    "se.perigee.android.seven",
    "com.freeletics.lite",
    "com.yazio.android",
    "com.sillens.shapeupclub",
    "com.fatsecret.android"
];

const OUTDOORS_AND_WEATHER = [
    "de.komoot.android",
    "net.osmand",
    "com.wikiloc.wikilocandroid",
    "cz.seznam.mapy",
    "com.flightradar24free",
    "com.windyty.android",
    "com.accuweather.android"
];

const FINANCE = [
    "com.revolut.revolut",
    "com.transferwise.android",
    "com.coinbase.android",
    "com.tradingview.tradingviewapp",
    "pt.sibs.android.mbway",
    "com.monefy.app.lite"
];

const TRAVEL_AND_MOBILITY = [
    "com.booking",
    "net.skyscanner.android.main",
    "com.ryanair.cheapflights",
    "com.citymapper.app.release",
    "com.tranzmate",
    "com.hostelworld.app",
    "com.getyourguide.android"
];

const PHOTO_AND_VIDEO = [
    "com.adobe.lrmobile",
    "com.niksoftware.snapseed",
    "com.camerasideas.instashot",
    "com.lemon.lvoverseas",
    "com.gopro.smarty",
    "tv.twitch.android.app"
];

const PRODUCTIVITY = [
    "com.todoist",
    "com.ticktick.task",
    "com.evernote",
    "com.google.android.keep",
    "com.microsoft.office.onenote",
    "com.anydo",
    "com.trello",
    "com.Slack",
    "us.zoom.videomeetings",
    "com.microsoft.teams",
    "cc.forestapp",
    "com.microsoft.office.outlook",
    "com.readdle.spark",
    "com.microsoft.todos"
];

const READING_AND_NEWS = [
    "com.amazon.kindle",
    "com.audible.application",
    "com.goodreads",
    "flipboard.app",
    "com.devhd.feedly",
    "com.ideashower.readitlater.pro",
    "com.medium.reader",
    "com.blinkslabs.blinkist.android",
    "com.nytimes.android"
];

const MUSIC_AND_AUDIO = [
    "com.soundcloud.android",
    "deezer.android.app",
    "fm.castbox.audiobook.radio.podcast",
    "com.bandcamp.android",
    "tunein.player",
    "com.audiomack"
];

const STREAMING = [
    "com.netflix.mediaclient",
    "com.amazon.avod.thirdpartyclient",
    "com.crunchyroll.crunchyroid",
    "com.mubi",
    "tv.pluto.android"
];

const SOCIAL_AND_DATING = [
    "com.badoo.mobile",
    "com.linkedin.android",
    "com.tumblr",
    "im.vector.app"
];

const LEARNING = [
    "com.babbel.mobile.android.en",
    "com.memrise.android.memrisecompanion",
    "org.khanacademy.android",
    "com.udemy.android",
    "org.coursera.android",
    "com.sololearn",
    "com.google.android.apps.translate",
    "com.microblink.photomath",
    "com.quizlet.quizletandroid",
    "com.ichi2.anki"
];

const AI_ASSISTANTS = [
    "ai.perplexity.app.android",
    "com.microsoft.copilot"
];

const SECURITY_AND_PRIVACY = [
    "ch.protonvpn.android",
    "ch.protonmail.android",
    "org.torproject.torbrowser",
    "com.duckduckgo.mobile.android",
    "com.google.android.apps.authenticator2",
    "com.kunzisoft.keepass.free"
];

const SHOPPING_AND_FOOD = [
    "com.ebay.mobile",
    "com.zzkko",
    "com.contextlogic.wish",
    "fr.vinted",
    "com.hellofresh.androidapp",
    "com.buzzfeed.tasty",
    "com.yummly.android"
];

const TOOLS_AND_HOME = [
    "com.intsig.camscanner",
    "org.localsend.localsend_app",
    "com.termux",
    "org.zwanoo.android.speedtest",
    "io.homeassistant.companion.android",
    "com.philips.lighting.hue2",
    "com.xiaomi.smarthome",
    "com.ifttt.ifttt",
    "com.server.auditor.ssh.client"
];

const GAMES = [
    "com.roblox.client",
    "com.innersloth.spacemafia",
    "com.supercell.brawlstars",
    "com.dts.freefireth",
    "com.miHoYo.GenshinImpact",
    "com.tencent.ig",
    "com.fingersoft.hillclimb",
    "com.moonactive.coinmaster",
    "com.imangi.templerun2",
    "com.chess",
    "org.lichess.mobileapp",
    "air.com.hypah.io.slither",
    "com.mediocre.smashhit",
    "com.outfit7.mytalkingtom2"
];

export const CATALOG: string[] = [
    ...new Set([
        ...MIND_AND_SLEEP,
        ...FITNESS_AND_HEALTH,
        ...OUTDOORS_AND_WEATHER,
        ...FINANCE,
        ...TRAVEL_AND_MOBILITY,
        ...PHOTO_AND_VIDEO,
        ...PRODUCTIVITY,
        ...READING_AND_NEWS,
        ...MUSIC_AND_AUDIO,
        ...STREAMING,
        ...SOCIAL_AND_DATING,
        ...LEARNING,
        ...AI_ASSISTANTS,
        ...SECURITY_AND_PRIVACY,
        ...SHOPPING_AND_FOOD,
        ...TOOLS_AND_HOME,
        ...GAMES
    ])
];
