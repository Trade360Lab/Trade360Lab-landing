import { ArrowRight, Check, Copy, Database, Rocket } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { OrbitalSystem } from '../OrbitalSystem'
import {
  apiMethods,
  architectureLayers,
  backtestStatuses,
  dataEntities,
  dataFlowSteps,
  endpoints,
  errorResponseSnippet,
  launchGuide,
  launchLocalServices,
  launchPorts,
  navigationItems,
  projectDescription,
  qualityCommands,
  quickStartSnippet,
  repositoryTree,
  runtimeCommands,
  statusIcons,
  type ApiMethod,
  type Endpoint,
  type SectionId,
} from './content'

type DocsPageProps = {
  isLightTheme: boolean
}

const lightTheme = {
  ambient: 'bg-[radial-gradient(circle_at_top,rgba(200,242,74,0.24)_0%,rgba(200,242,74,0)_38%),radial-gradient(circle_at_85%_18%,rgba(243,180,108,0.16)_0%,rgba(243,180,108,0)_28%)]',
  container: 'bg-[#f6f4ec] text-[#182016]',
  corner: 'border-[#c8d59f]/70',
  footer: 'text-[#748063]',
  ghostPrimaryOpacity: 'opacity-[0.08]',
  ghostPrimaryStroke: '2px rgba(32, 37, 30, 0.12)',
  ghostSecondaryOpacity: 'opacity-[0.05]',
  ghostSecondaryStroke: '2px rgba(143, 170, 34, 0.14)',
  gridOpacity: 'opacity-60',
  gridPattern:
    'linear-gradient(rgba(37, 46, 32, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 46, 32, 0.05) 1px, transparent 1px)',
  muted: 'text-[#2d3527]/78',
  panel: 'border-[#c8d59f]/60 bg-white/70 shadow-[0_20px_50px_rgba(31,39,29,0.09)]',
  panelStrong: 'border-[#bfc9ac] bg-[#fffef8]/86 shadow-[0_24px_70px_rgba(31,39,29,0.12)]',
  pill: 'border-[#bfc9ac] bg-white/70 text-[#2d3527]',
  titleLab: 'text-[#8faa22] drop-shadow-[0_12px_28px_rgba(143,170,34,0.18)]',
  titleLine: 'via-[#9bb43d]/45',
  titleMain: 'text-[#1f271d] drop-shadow-[0_14px_24px_rgba(31,39,29,0.08)]',
}

const darkTheme = {
  ambient: 'bg-[radial-gradient(circle_at_top,rgba(200,242,74,0.12)_0%,rgba(200,242,74,0)_32%),radial-gradient(circle_at_20%_80%,rgba(0,255,136,0.08)_0%,rgba(0,255,136,0)_28%)]',
  container: 'bg-[#0a0a0a] text-white',
  corner: 'border-[#c8f24a]/20',
  footer: 'text-[#c8f24a]/40',
  ghostPrimaryOpacity: 'opacity-[0.03]',
  ghostPrimaryStroke: '2px rgba(200, 242, 74, 0.3)',
  ghostSecondaryOpacity: 'opacity-[0.02]',
  ghostSecondaryStroke: '2px rgba(200, 242, 74, 0.2)',
  gridOpacity: 'opacity-20',
  gridPattern:
    'linear-gradient(rgba(200, 242, 74, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 242, 74, 0.1) 1px, transparent 1px)',
  muted: 'text-white/72',
  panel: 'border-[#c8f24a]/18 bg-black/34 shadow-[0_24px_70px_rgba(0,0,0,0.3)]',
  panelStrong: 'border-[#c8f24a]/24 bg-black/46 shadow-[0_28px_90px_rgba(0,0,0,0.38)]',
  pill: 'border-[#c8f24a]/28 bg-[#c8f24a]/8 text-[#c8f24a]',
  titleLab: 'text-[#c8f24a]/80 drop-shadow-[0_0_15px_rgba(200,242,74,0.2)]',
  titleLine: 'via-[#c8f24a]/40',
  titleMain: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]',
}

function CodePanel({
  title,
  code,
  compact = false,
  dense = false,
}: {
  title: string
  code: string
  compact?: boolean
  dense?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-current/10 bg-black/52 text-white">
      <div className={`flex items-center justify-between gap-3 border-b border-white/10 px-4 ${dense ? 'py-2' : 'py-2.5'}`}>
        <p className={`${dense ? 'text-[11px]' : 'text-xs'} font-bold uppercase tracking-[0.18em] text-[#c8f24a]`}>{title}</p>
        <button
          type="button"
          onClick={copyCode}
          className={`${dense ? 'h-7 w-7' : 'h-8 w-8'} inline-flex items-center justify-center rounded-md border border-white/10 text-white/70 hover:text-[#c8f24a]`}
          aria-label={`Скопировать ${title}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className={`scrollbar-hidden overflow-auto px-4 text-xs text-[#dce8c2] ${dense ? 'max-h-24 py-1.5 leading-4' : `py-3 leading-6 ${compact ? 'max-h-44' : 'max-h-72'}`}`}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

const methodStyles: Record<ApiMethod, string> = {
  GET: 'bg-[#69d2ff]/18 text-[#0d668a] dark:text-[#9fe8ff] border-[#69d2ff]/35',
  POST: 'bg-[#c8f24a] text-black border-[#c8f24a]',
  'PUT/PATCH': 'bg-[#f3b46c]/18 text-[#92571a] dark:text-[#ffd29f] border-[#f3b46c]/35',
  DELETE: 'bg-[#ff6b6b]/16 text-[#9f2525] dark:text-[#ffb4b4] border-[#ff6b6b]/35',
}

function MethodBadge({ method }: { method: ApiMethod }) {
  return (
    <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${methodStyles[method]}`}>
      {method}
    </span>
  )
}

export function DocsPage({ isLightTheme }: DocsPageProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const shouldReduceMotion = useReducedMotion()
  const theme = isLightTheme ? lightTheme : darkTheme
  const activeLabel = navigationItems.find((item) => item.id === activeSection)?.label

  return (
    <div className={`relative h-screen w-full overflow-hidden ${theme.container}`}>
      <div
        className={`absolute inset-0 ${theme.gridOpacity}`}
        style={{ backgroundImage: theme.gridPattern, backgroundSize: '50px 50px' }}
      />
      <div className={`absolute inset-0 ${theme.ambient}`} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className={`absolute text-[20vw] font-bold whitespace-nowrap ${theme.ghostPrimaryOpacity}`}
          style={{ color: 'transparent', fontFamily: 'Sora, sans-serif', WebkitTextStroke: theme.ghostPrimaryStroke }}
        >
          T360 LAB
        </div>
        <div
          className={`absolute top-[20%] text-[20vw] font-bold whitespace-nowrap ${theme.ghostSecondaryOpacity}`}
          style={{ color: 'transparent', fontFamily: 'Sora, sans-serif', WebkitTextStroke: theme.ghostSecondaryStroke }}
        >
          T360 LAB
        </div>
      </div>

      <OrbitalSystem isLightTheme={isLightTheme} />

      <div className="relative z-10 flex h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className={`mb-3 rounded-lg border px-4 py-3 backdrop-blur-xl ${theme.panel}`}>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center p-0.5">
                <img
                  src={isLightTheme ? '/BlackLogo.png' : '/GreenLogo.png'}
                  alt="Project logo"
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              </div>
              <div>
                <p className="text-base font-bold leading-none sm:text-lg">Documentation</p>
              </div>
            </div>
            <nav className="scrollbar-hidden flex gap-2 overflow-x-auto" aria-label="Разделы документации">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`inline-flex w-40 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    activeSection === item.id
                      ? 'border-[#c8f24a] bg-[#c8f24a] text-black shadow-[0_0_24px_rgba(200,242,74,0.24)]'
                      : `${theme.pill} hover:border-[#c8f24a] hover:text-[#8faa22] dark:hover:text-[#c8f24a]`
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className={`hidden h-fit flex-col rounded-lg border p-4 backdrop-blur-xl lg:flex ${theme.panel}`}>
            <div>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="relative mb-4"
              >
                <motion.div
                  className="absolute inset-0 bg-[#c8f24a] opacity-20 blur-2xl"
                  animate={shouldReduceMotion ? undefined : { opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 6.5, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
                />
                <div className="relative">
                  <h1 className="flex items-baseline text-[3.4rem] font-black leading-none tracking-tight sm:text-[4.8rem] lg:text-[5.6rem]">
                    <span className={theme.titleMain}>T360</span>
                    <span className={`-ml-[0.04em] text-[2.15rem] font-bold sm:text-[3rem] lg:text-[3.45rem] ${theme.titleLab}`}>
                      LAB
                    </span>
                  </h1>
                  <div className={`mt-1 h-[2px] bg-gradient-to-r from-transparent ${theme.titleLine} to-transparent`} />
                </div>
              </motion.div>
              <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#8faa22] dark:text-[#c8f24a] sm:text-base">
                {activeLabel}
              </p>
              <p className={`mt-3 max-w-xl text-base font-semibold leading-7 sm:text-lg ${theme.muted}`}>
                {projectDescription}
              </p>
            </div>
            <div className={`mt-4 hidden rounded-lg border p-3 text-xs leading-5 lg:block ${theme.pill}`}>
              STRATEGY RESEARCH / BACKTESTING / OPTIMIZATION
            </div>
          </aside>

          <div className={`min-h-0 overflow-hidden rounded-lg border p-4 backdrop-blur-xl ${theme.panelStrong}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className="scrollbar-hidden h-full min-h-0 overflow-y-auto pr-1"
              >
                {activeSection === 'overview' ? (
                  <OverviewView onSelect={setActiveSection} theme={theme} />
                ) : null}
                {activeSection === 'architecture' ? (
                  <ArchitectureView isLightTheme={isLightTheme} theme={theme} />
                ) : null}
                {activeSection === 'api' ? <ApiView theme={theme} /> : null}
                {activeSection === 'lifecycle' ? <LifecycleView theme={theme} /> : null}
                {activeSection === 'data-model' ? <DataModelView theme={theme} /> : null}
                {activeSection === 'launch' ? <LaunchView theme={theme} /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className={`absolute top-0 left-0 h-32 w-32 border-l-2 border-t-2 ${theme.corner}`} />
      <div className={`absolute top-0 right-0 h-32 w-32 border-r-2 border-t-2 ${theme.corner}`} />
      <div className={`absolute bottom-0 left-0 h-32 w-32 border-l-2 border-b-2 ${theme.corner}`} />
      <div className={`absolute right-0 bottom-0 h-32 w-32 border-r-2 border-b-2 ${theme.corner}`} />
    </div>
  )
}

function OverviewView({ onSelect, theme }: { onSelect: (section: SectionId) => void; theme: typeof lightTheme }) {
  return (
    <div className="h-full min-h-0">
      <OverviewMermaidDiagram onSelect={onSelect} theme={theme} />
    </div>
  )
}

function OverviewMermaidDiagram({
  onSelect,
  theme,
}: {
  onSelect: (section: SectionId) => void
  theme: typeof lightTheme
}) {
  const nodeClass =
    'rounded-lg border border-[#c8f24a]/32 bg-white px-4 py-3 text-center text-[#182016] shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition-colors duration-150 hover:border-[#c8f24a]/70 hover:bg-white/92 dark:bg-black dark:text-white dark:hover:bg-black/88'
  const accentBaseClass =
    'rounded-lg border bg-white px-4 py-3 text-center shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition-transform duration-150 hover:-translate-y-0.5 dark:bg-black'

  return (
    <div className="grid h-full min-h-0 content-center gap-4 rounded-lg border border-current/10 bg-transparent p-4 shadow-none">
      <div className="grid items-center gap-3 xl:grid-cols-[1fr_34px_1fr_34px_1fr]">
        <button type="button" onClick={() => onSelect('overview')} className={`${nodeClass} min-h-24`}>
          <p className="text-base font-black">Trade360Lab</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2d3527]/68 dark:text-white/68">
            Quantitative Trading Lab
          </p>
        </button>
        <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-[#8faa22] dark:text-[#c8f24a] xl:rotate-0" />
        <div className="grid gap-3">
          <a
            href="https://github.com/Trade360Lab/Trade360Lab-landing.git"
            target="_blank"
            rel="noreferrer"
            className={`${nodeClass} min-h-20`}
          >
            <p className="font-bold">Trade360Lab-landing</p>
            <p className="mt-1 text-xs leading-5 text-[#2d3527]/68 dark:text-white/68">Website</p>
          </a>
          <a
            href="https://github.com/Trade360Lab"
            target="_blank"
            rel="noreferrer"
            className={`${nodeClass} min-h-20`}
          >
            <p className="font-bold">GitHub</p>
            <p className="mt-1 text-xs leading-5 text-[#2d3527]/68 dark:text-white/68">Organization</p>
          </a>
        </div>
        <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-[#8faa22] dark:text-[#c8f24a] xl:rotate-0" />
        <div className="grid gap-3">
          <a
            href="https://github.com/Trade360Lab/Trade360Lab.git"
            target="_blank"
            rel="noreferrer"
            className={`${nodeClass} min-h-20`}
          >
            <p className="font-bold">Main Repo</p>
            <p className="mt-1 text-xs leading-5 text-[#2d3527]/68 dark:text-white/68">Trade360Lab</p>
          </a>
          <a
            href="https://github.com/Trade360Lab/Trade360Lab-Strategies.git"
            target="_blank"
            rel="noreferrer"
            className={`${accentBaseClass} min-h-20 border-[#00C2FF] text-[#182016] hover:shadow-[0_0_24px_rgba(0,194,255,0.2)] dark:text-[#c8f24a]`}
          >
            <p className="font-bold">Strategies Repo</p>
            <p className="mt-1 text-xs leading-5 text-[#182016]/70 dark:text-[#c8f24a]/70">Trade360Lab-Strategies</p>
          </a>
        </div>
      </div>
      <div className="grid items-start gap-3 xl:grid-cols-[1fr_34px_1fr]">
        <div className="hidden xl:block" />
        <div className="hidden xl:block" />
        <div className="grid gap-3">
          <a
            href="https://github.com/Trade360Lab/Trade360Lab-Analyzer-BTC.git"
            target="_blank"
            rel="noreferrer"
            className={`${accentBaseClass} min-h-20 border-[#FFFF00] text-[#182016] hover:shadow-[0_0_24px_rgba(255,255,0,0.2)] dark:text-[#c8f24a]`}
          >
            <p className="font-bold">BTC Analyzer Bot</p>
            <p className="mt-1 text-xs leading-5 text-[#182016]/70 dark:text-[#c8f24a]/70">GitHub repository</p>
          </a>
        </div>
      </div>
      <pre className="sr-only">{`flowchart LR
    A["Trade360Lab<br/>Quantitative Trading Lab"]
    A --> B["Trade360Lab-landing<br/>Website"]
    A --> C["GitHub<br/>Organization"]
    C --> D["Main Repo<br/>Trade360Lab"]
    C --> E["Strategies Repo<br/>Trade360Lab-Strategies"]
    C --> G["BTC Analyzer Bot"]`}</pre>
    </div>
  )
}

function ArchitectureView({ isLightTheme, theme }: { isLightTheme: boolean; theme: typeof lightTheme }) {
  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {architectureLayers.map((layer) => {
          const Icon = layer.icon
          return (
            <div key={layer.title} className={`rounded-lg border p-4 ${theme.panel}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center">
                  <img
                    src={`https://go-skill-icons.vercel.app/api/icons?i=${layer.skillIcon}&theme=${isLightTheme ? 'light' : 'dark'}`}
                    alt=""
                    className="h-9 w-9 object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-55">{layer.sourceName}</p>
                  <h3 className="font-bold">{layer.title}</h3>
                </div>
                <Icon className="ml-auto h-4 w-4 opacity-35" />
              </div>
              <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{layer.description}</p>
              <div className="mt-3 grid gap-1.5">
                {layer.details.map((detail) => (
                  <div key={detail} className={`rounded-md border px-2.5 py-1.5 text-xs leading-5 ${theme.pill}`}>
                    {detail}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {layer.responsibilities.map((item) => (
                  <span key={item} className={`rounded-md border px-2 py-1 text-xs ${theme.pill}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid min-h-0 gap-3">
        <div className={`rounded-lg border p-3 ${theme.panel}`}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8faa22] dark:text-[#c8f24a]">
            Поток данных
          </p>
          <div className="mt-3 grid max-h-[33rem] gap-2 overflow-y-auto pr-1">
            {dataFlowSteps.map((step, index) => (
              <div key={step.title} className={`grid grid-cols-[28px_1fr] gap-2 rounded-lg border p-2.5 ${theme.pill}`}>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c8f24a] text-[11px] font-black text-black">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{step.title}</h4>
                  <p className="mt-0.5 text-[11px] leading-4 opacity-75">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`rounded-lg border p-3 ${theme.panel}`}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8faa22] dark:text-[#c8f24a]">
            Структура репозитория
          </p>
          <pre className="scrollbar-hidden mt-3 overflow-x-auto rounded-lg border border-[#c8f24a]/24 bg-black/70 p-3 text-[11px] leading-5 text-[#dce8c2] shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
            <code>{repositoryTree}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function ApiView({ theme }: { theme: typeof lightTheme }) {
  const firstMethodWithEndpoints = apiMethods.find((method) =>
    endpoints.some((endpoint) => endpoint.method === method.id),
  )?.id ?? 'GET'
  const [activeMethod, setActiveMethod] = useState<ApiMethod>(firstMethodWithEndpoints)
  const [selectedEndpointPath, setSelectedEndpointPath] = useState(
    endpoints.find((endpoint) => endpoint.method === firstMethodWithEndpoints)?.path ?? endpoints[0]?.path ?? '',
  )
  const methodEndpoints = endpoints.filter((endpoint) => endpoint.method === activeMethod)
  const selectedEndpoint =
    methodEndpoints.find((endpoint) => endpoint.path === selectedEndpointPath) ?? methodEndpoints[0]

  const selectMethod = (method: ApiMethod, nextEndpoints: Endpoint[]) => {
    if (nextEndpoints.length === 0) {
      return
    }

    setActiveMethod(method)
    setSelectedEndpointPath(nextEndpoints[0].path)
  }

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="grid min-h-0 gap-2">
        <div className={`rounded-lg border p-2.5 ${theme.panel}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8faa22] dark:text-[#c8f24a]">
            HTTP endpoints
          </p>
          <div className="scrollbar-hidden mt-2 flex gap-1.5 overflow-x-auto" aria-label="HTTP методы">
            {apiMethods.map((method) => {
              const nextEndpoints = endpoints.filter((endpoint) => endpoint.method === method.id)
              const isActive = activeMethod === method.id
              const isDisabled = nextEndpoints.length === 0

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => selectMethod(method.id, nextEndpoints)}
                  disabled={isDisabled}
                  className={`h-7 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-black leading-none transition-colors ${
                    isActive
                      ? `${methodStyles[method.id]} shadow-[0_0_16px_rgba(200,242,74,0.14)]`
                      : isDisabled
                        ? 'border-current/10 bg-current/[0.03] opacity-45'
                        : `${theme.pill} hover:border-[#c8f24a]`
                  }`}
                >
                  {method.label}
                  <span className="ml-1.5 opacity-60">{nextEndpoints.length}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="scrollbar-hidden grid max-h-56 gap-2 overflow-y-auto pr-1">
          {methodEndpoints.map((endpoint) => {
            const isSelected = selectedEndpoint?.path === endpoint.path

            return (
              <button
                key={`${endpoint.method}-${endpoint.path}`}
                type="button"
                onClick={() => setSelectedEndpointPath(endpoint.path)}
                className={`h-[72px] overflow-hidden rounded-lg border p-3 text-left transition-colors ${
                  isSelected ? 'border-[#c8f24a] bg-[#c8f24a]/10' : theme.panel
                }`}
              >
                <div className="flex items-start gap-3">
                  <MethodBadge method={endpoint.method} />
                  <div>
                    <p className="font-mono text-sm font-bold">{endpoint.path}</p>
                    <p className={`mt-1 line-clamp-1 text-xs leading-5 ${theme.muted}`}>{endpoint.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
          {methodEndpoints.length === 0 ? (
            <div className={`rounded-lg border p-3 text-sm leading-6 ${theme.pill}`}>
              Для выбранного метода в текущей документации нет опубликованных endpoint-ов.
            </div>
          ) : null}
        </div>

        {selectedEndpoint ? (
          <div className={`rounded-lg border p-3 ${theme.panel}`}>
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method={selectedEndpoint.method} />
              <span className="font-mono text-sm font-bold">{selectedEndpoint.path}</span>
            </div>
            <p className={`mt-1 line-clamp-1 text-xs leading-5 ${theme.muted}`}>{selectedEndpoint.description}</p>
          </div>
        ) : null}
      </div>
      <div className="grid min-h-0 gap-3">
        {selectedEndpoint ? (
          <>
            <div className={`rounded-lg border p-2 text-[11px] leading-4 ${theme.pill}`}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-bold text-[#8faa22] dark:text-[#c8f24a]">Ошибки API</p>
                <p>JSON: timestamp, status, error, message и path.</p>
              </div>
            </div>
            <div className="grid items-start gap-3 lg:grid-cols-2">
              {selectedEndpoint.request ? (
                <CodePanel
                  title={`${selectedEndpoint.method} ${selectedEndpoint.path} запрос`}
                  code={selectedEndpoint.request}
                  compact
                />
              ) : null}
              <CodePanel
                title={`${selectedEndpoint.method} ${selectedEndpoint.path} ответ`}
                code={selectedEndpoint.response}
                compact
                dense
              />
              <CodePanel title="Ошибка API" code={errorResponseSnippet} compact dense />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function LifecycleView({ theme }: { theme: typeof lightTheme }) {
  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {backtestStatuses.map((item) => {
          const Icon = statusIcons[item.tone]
          return (
            <div key={item.status} className={`rounded-lg border p-4 ${theme.panel}`}>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-[#8faa22] dark:text-[#c8f24a]" />
                <span className="rounded-md bg-[#c8f24a] px-2.5 py-1 text-xs font-black text-black">{item.status}</span>
              </div>
              <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>{item.description}</p>
            </div>
          )
        })}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {dataFlowSteps.map((step, index) => (
          <div key={step.title} className={`rounded-lg border p-3 ${theme.panel}`}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8faa22] dark:text-[#c8f24a]">
              0{index + 1}
            </p>
            <h3 className="mt-1 font-bold">{step.title}</h3>
            <p className={`mt-1 text-sm leading-5 ${theme.muted}`}>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataModelView({ theme }: { theme: typeof lightTheme }) {
  return (
    <div className="grid h-full min-h-0 gap-3 sm:grid-cols-2">
      {dataEntities.map((entity) => (
        <div key={entity.name} className={`rounded-lg border p-4 ${theme.panel}`}>
          <div className="flex items-start gap-3">
            <Database className="mt-1 h-5 w-5 shrink-0 text-[#8faa22] dark:text-[#c8f24a]" />
            <div>
              <h3 className="font-mono text-lg font-bold">{entity.name}</h3>
              <p className={`mt-1 text-sm leading-5 ${theme.muted}`}>{entity.description}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entity.fields.map((field) => (
              <span key={field} className={`rounded-md border px-2 py-1 text-[11px] ${theme.pill}`}>
                {field}
              </span>
            ))}
          </div>
          <div className="mt-3 grid gap-2">
            {entity.details.map((detail) => (
              <div key={detail.label} className={`rounded-md border px-3 py-2 ${theme.pill}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-55">{detail.label}</p>
                <p className="mt-1 text-xs leading-5">{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-1.5">
            {entity.notes.map((note) => (
              <div key={note} className={`flex items-start gap-2 text-xs leading-5 ${theme.muted}`}>
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8faa22] dark:text-[#c8f24a]" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function LaunchView({ theme }: { theme: typeof lightTheme }) {
  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="grid min-h-0 gap-3">
        <div className={`rounded-lg border p-4 ${theme.panel}`}>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[#8faa22] dark:text-[#c8f24a]" />
            <h3 className="text-lg font-bold">README quick start</h3>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {launchGuide.map((group) => (
              <div key={group.title} className={`rounded-lg border p-3 ${theme.pill}`}>
                <p className="text-xs font-black uppercase tracking-[0.18em] opacity-60">{group.title}</p>
                <h4 className="mt-1 font-bold">{group.items[0]}</h4>
                <p className="mt-2 text-xs leading-5 opacity-78">{group.items[1]}</p>
                <p className="mt-1 text-xs leading-5 opacity-78">{group.items[2]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${theme.panel}`}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8faa22] dark:text-[#c8f24a]">
            Сервисы и порты
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {launchPorts.map((port) => (
              <div key={port.service} className={`rounded-lg border p-3 ${theme.pill}`}>
                <p className="font-bold">{port.service}</p>
                <p className="mt-1 font-mono text-xs">{port.url}</p>
                <p className="mt-1 text-[11px] leading-4 opacity-60">{port.env}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${theme.panel}`}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8faa22] dark:text-[#c8f24a]">
            Локальный режим
          </p>
          <div className="mt-3 grid gap-2">
            {launchLocalServices.map((service) => (
              <div key={service.title} className={`rounded-lg border p-3 ${theme.pill}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{service.title}</p>
                  <span className="rounded-md bg-black/70 px-2 py-1 font-mono text-[11px] text-[#dce8c2] dark:bg-white/10">
                    {service.path}
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs leading-5">{service.command}</p>
                <p className="mt-1 text-xs leading-5 opacity-70">{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 gap-3">
        <CodePanel title="Docker: весь стек" code={quickStartSnippet} compact />
        <CodePanel title="Порты из README" code={qualityCommands} compact />
        <CodePanel title="Локальная разработка" code={runtimeCommands} compact />
      </div>
    </div>
  )
}
