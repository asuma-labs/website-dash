// app/api/auth/update-username/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const reservedWords = [
  // === System & Admin ===
  'admin', 'administrator', 'root', 'superuser', 'su', 'sysadmin', 'moderator',
  'staff', 'owner', 'founder', 'webmaster', 'postmaster', 'hostmaster',
  'dev', 'developer', 'system', 'sys',

  // === Dashboard & Panel ===
  'dashboard', 'dash', 'panel', 'cp', 'cpanel', 'control', 'manage', 'management',

  // === Auth & Security ===
  'auth', 'oauth', 'openid', 'sso', 'ldap', 'jwt', 'token', 'secret', 'key',
  'login', 'logout', 'signin', 'signup', 'signout', 'register', 'registration',
  'forgot', 'forgot-password', 'reset', 'reset-password', 'verify', 'verification',
  'activate', 'activation', 'deactivate', 'suspend', 'banned', 'ban',
  'password', 'passwd', 'pwd', 'session', '2fa', 'otp',

  // === Web Routes & Paths ===
  'api', 'api1', 'api2', 'v1', 'v2', 'v3', 'v4', 'v5',
  'home', 'index', 'main', 'app', 'apps',
  'about', 'about-us', 'contact', 'contact-us', 'help', 'support', 'faq',
  'terms', 'tos', 'privacy', 'privacy-policy', 'policy', 'legal', 'disclaimer',
  'status', 'stats', 'ping', 'health', 'healthcheck', 'uptime',
  'docs', 'documentation', 'wiki', 'guide', 'tutorial', 'learn',
  'forum', 'community', 'member', 'members', 'group', 'groups',
  'account', 'accounts', 'profile', 'profiles', 'user', 'username', 'users',
  'settings', 'setting', 'config', 'configuration', 'preferences',
  'search', 'find', 'browse', 'explore', 'discover', 'filter', 'sort',
  'upload', 'uploads', 'download', 'downloads', 'file', 'files',
  'media', 'image', 'images', 'video', 'videos', 'audio', 'photo', 'photos',
  'asset', 'assets', 'static', 'public', 'private', 'protected',
  'cache', 'tmp', 'temp', 'log', 'logs', 'backup', 'backups',

  // === Blog & Content ===
  'blog', 'blogs', 'news', 'article', 'articles', 'post', 'posts',
  'tag', 'tags', 'category', 'categories', 'archive', 'archives',
  'author', 'authors', 'comment', 'comments', 'thread', 'threads',
  'topic', 'topics', 'feed', 'rss', 'atom',

  // === E-Commerce ===
  'shop', 'store', 'product', 'products', 'item', 'items',
  'cart', 'checkout', 'order', 'orders', 'payment', 'payments',
  'invoice', 'invoices', 'billing', 'bill', 'pricing', 'price', 'plan', 'plans',
  'buy', 'sell', 'deal', 'deals', 'promo', 'promotion', 'discount', 'coupon',
  'offer', 'offers', 'voucher', 'gift', 'giftcard', 'subscription', 'subscribe',
  'membership', 'memberships', 'trial', 'free', 'premium', 'pro', 'enterprise',
  'wishlist', 'compare', 'review', 'reviews', 'rating',

  // === Hosting & Domain ===
  'hosting', 'domain', 'domains', 'server', 'servers', 'dns', 'ssl', 'tls',
  'mail', 'email', 'webmail', 'smtp', 'imap', 'pop', 'pop3',
  'ftp', 'sftp', 'ssh', 'cdn', 'proxy', 'gateway', 'loadbalancer',

  // === Database ===
  'db', 'database', 'mysql', 'postgres', 'mongo', 'redis', 'sql', 'nosql',
  'sqlite', 'mariadb', 'oracle',

  // === Tech Stack ===
  'node', 'npm', 'yarn', 'pnpm', 'git', 'github', 'gitlab', 'bitbucket',
  'docker', 'kubernetes', 'k8s', 'pod', 'container',
  'php', 'python', 'java', 'ruby', 'rust', 'go', 'golang',
  'html', 'css', 'javascript', 'typescript', 'js', 'ts',
  'json', 'xml', 'yaml', 'yml', 'csv', 'graphql', 'rest', 'soap',

  // === Subdomain & Testing ===
  'www', 'ww', 'web', 'site', 'website', 'm', 'mobile',
  'dev', 'staging', 'test', 'testing', 'demo', 'beta', 'alpha', 'sandbox',
  'preview', 'draft', 'debug', 'local', 'localhost', '127001', '0000',

  // === Brand Protection ===
  'official', 'verified', 'real', 'original', 'genuine', 'legit',

  // === Spam / Abuse ===
  'null', 'undefined', 'none', 'void', 'nan', 'inf', 'infinity',
  'true', 'false', 'yes', 'no', 'on', 'off', 'all', 'any', 'each', 'every',
  'test', 'testing', 'dummy', 'sample', 'example', 'demo',
  'guest', 'anonymous', 'anon', 'nobody', 'anyone',
  'spam', 'abuse', 'report', 'scam', 'phising', 'hack', 'hacker',
  'crack', 'exploit', 'ddos', 'deface',

  // === Social & Brand ===
  'asuma', 'asumabot',
  'whatsapp', 'wa', 'wabot', 'telegram', 'bot', 'robot',
  'facebook', 'fb', 'google', 'apple', 'twitter', 'x', 'instagram', 'ig',
  'tiktok', 'youtube', 'linkedin', 'github', 'discord', 'slack', 'twitch',
  'signal', 'line', 'wechat', 'snapchat', 'reddit', 'pinterest',

  // === Marketing & Analytics ===
  'ads', 'ad', 'advertise', 'advertising', 'sponsor', 'sponsored',
  'affiliate', 'referral', 'ref', 'invite', 'invites',
  'track', 'tracking', 'analytics', 'metric', 'metrics', 'statistic',
  'newsletter', 'subscribe', 'unsubscribe', 'mailing', 'campaign',
  'survey', 'poll', 'feedback', 'testimonial',

  // === Web Common ===
  '404', '500', 'error', 'errors', 'maintenance', 'offline',
  'sitemap', 'robots', 'manifest', 'humans', 'crossdomain',
  'favicon', 'icon', 'icons', 'font', 'fonts',
  'service', 'services', 'page', 'pages', 'feature', 'features',
  'customer', 'client', 'partner', 'partners',
  'cron', 'job', 'jobs', 'task', 'tasks', 'queue', 'worker',

  // === Other Actions ===
  'callback', 'webhook', 'hook', 'endpoint', 'redirect', 'url', 'uri',
  'new', 'edit', 'view', 'list', 'delete', 'remove', 'add', 'create',
  'select', 'insert', 'update', 'drop', 'alter', 'grant', 'revoke',
  'script', 'alert', 'cookie', 'session', 'storage',

  // === Kata Kotor / Umpatan ===
  'anjing', 'bangsat', 'kontol', 'memek', 'ngentot', 'jancok', 'babi', 'tolol',
  'goblok', 'tai', 'bajingan', 'sial', 'setan', 'kampret', 'brengsek',
  'bego', 'idiot', 'gila', 'sinting', 'edan', 'bodat', 'pecun', 'fuck',
  'shit', 'asshole', 'bastard', 'damn', 'cunt', 'dick', 'pussy',
  'motherfucker', 'bitch', 'whore', 'slut',

  // === Istilah Bot / Automate ===
  'jadibot', 'bot', 'botz', 'automate', 'scrape', 'crawler', 'spider',

  // === Umum Lain ===
  'chat', 'message', 'inbox', 'notification', 'alert',
  'site', 'sites', 'link', 'links'
];

export async function PATCH(request: Request) {
  const cookieStore = request.headers.get('cookie') || ''
  const token = cookieStore.match(/auth_token=([^;]+)/)?.[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: magicToken } = await supabase
    .from('magic_tokens')
    .select('user_id')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (!magicToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, username_changed_at')
    .eq('id', magicToken.user_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (profile.username_changed_at) {
    const lastChange = new Date(profile.username_changed_at)
    const nextAllowed = new Date(lastChange)
    nextAllowed.setMonth(nextAllowed.getMonth() + 1)

    if (new Date() < nextAllowed) {
      const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return NextResponse.json({
        error: `Kamu hanya bisa ganti username 1x per bulan. Coba lagi dalam ${daysLeft} hari.`
      }, { status: 429 })
    }
  }

  const { newUsername } = await request.json()
  if (!newUsername) return NextResponse.json({ error: 'Username baru diperlukan' }, { status: 400 })

  const trimmed = newUsername.toLowerCase().trim()

  if (trimmed.length < 3 || trimmed.length > 20) {
    return NextResponse.json({ error: 'Username harus 3-20 karakter' }, { status: 400 })
  }

  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return NextResponse.json({ error: 'Username hanya boleh huruf kecil, angka, -, _' }, { status: 400 })
  }

  if (reservedWords.includes(trimmed)) {
    return NextResponse.json({ error: 'Username tidak tersedia' }, { status: 409 })
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', trimmed)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 409 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      username: trimmed,
      username_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', magicToken.user_id)

  if (error) return NextResponse.json({ error: 'Gagal update' }, { status: 500 })

  return NextResponse.json({ success: true, username: trimmed })
}
