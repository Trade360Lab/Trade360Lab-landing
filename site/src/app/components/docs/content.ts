import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle2,
  CircleDashed,
  Code2,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  Rocket,
  ServerCog,
  ShieldAlert,
  TerminalSquare,
} from 'lucide-react'

export type SectionId = 'overview' | 'architecture' | 'api' | 'lifecycle' | 'data-model' | 'launch'

export type NavigationItem = {
  id: SectionId
  label: string
}

export type OverviewCard = {
  id: SectionId
  title: string
  description: string
  icon: LucideIcon
}

export type ArchitectureLayer = {
  title: string
  sourceName: string
  description: string
  responsibilities: string[]
  details: string[]
  icon: LucideIcon
  skillIcon: string
}

export type ApiMethod = 'GET' | 'POST' | 'PUT/PATCH' | 'DELETE'

export type ApiMethodOption = {
  id: ApiMethod
  label: string
}

export type Endpoint = {
  method: ApiMethod
  path: string
  description: string
  source: string
  request?: string
  response: string
}

export type BacktestStatus = {
  status: string
  tone: 'idle' | 'active' | 'success' | 'danger'
  description: string
}

export type FlowStep = {
  title: string
  description: string
}

export type DataEntity = {
  name: string
  description: string
  fields: string[]
  notes: string[]
  details: { label: string; value: string }[]
}

export type LaunchGroup = {
  title: string
  items: string[]
}

export type LaunchPort = {
  service: string
  url: string
  env: string
}

export type LaunchLocalService = {
  title: string
  path: string
  command: string
  detail: string
}

export const projectDescription =
  'Лаборатория для разработки, тестирования и подготовки торговых стратегий. Платформа объединяет загрузку рыночных данных, управление стратегиями, запуск бэктестов, анализ результатов и подготовку к paper/live trading в едином рабочем процессе.'

export const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'architecture', label: 'Архитектура' },
  { id: 'api', label: 'API' },
  { id: 'lifecycle', label: 'Жизненный цикл' },
  { id: 'data-model', label: 'Модель данных' },
  { id: 'launch', label: 'Запуск' },
]

export const overviewCards: OverviewCard[] = [
  {
    id: 'architecture',
    title: 'Архитектура',
    description: 'Четыре слоя: frontend, Spring Boot API, Python engine и PostgreSQL.',
    icon: Layers3,
  },
  {
    id: 'api',
    title: 'API',
    description: 'Endpoint-ы бэктеста: запуск, статус, сделки, equity curve и формат ошибок.',
    icon: Code2,
  },
  {
    id: 'lifecycle',
    title: 'Жизненный цикл',
    description: 'Состояния запуска от валидации до сохраненных артефактов.',
    icon: GitBranch,
  },
  {
    id: 'data-model',
    title: 'Модель данных',
    description: 'Таблицы runs, trades, equity points и candles для выполнения бэктеста.',
    icon: Database,
  },
  {
    id: 'launch',
    title: 'Запуск',
    description: 'Локальный dev-сервер, production-сборка, Docker и базовые проверки.',
    icon: Rocket,
  },
]

export const architectureLayers: ArchitectureLayer[] = [
  {
    title: 'Next.js',
    sourceName: 'frontend',
    description: 'Next.js слой интерфейса: собирает рабочее пространство, экран данных, карточки запусков и сравнение результатов.',
    responsibilities: ['Workspace', 'Data', 'Backtests', 'Compare'],
    details: ['Next.js UI + API proxy', 'Strategy upload', 'Charts & visualization'],
    icon: Globe2,
    skillIcon: 'nextjs',
  },
  {
    title: 'Backend',
    sourceName: 'backend',
    description: 'Spring Boot API принимает REST-запросы, управляет lifecycle запусков, читает свечи и сохраняет артефакты.',
    responsibilities: ['Controllers', 'DTO', 'BacktestService', 'Repositories'],
    details: ['Dataset API', 'Strategy management', 'Run control'],
    icon: ServerCog,
    skillIcon: 'spring',
  },
  {
    title: 'Backend',
    sourceName: 'backend',
    description: 'Python parser/backtesting service готовит данные, запускает стратегии, считает индикаторы и возвращает JSON.',
    responsibilities: ['Parser', 'Strategy Runner', 'Backtesting', 'Indicators'],
    details: ['Exchange adapters', 'CSV processing', 'Metrics, trades, equity'],
    icon: TerminalSquare,
    skillIcon: 'python',
  },
  {
    title: 'DataBase',
    sourceName: 'database',
    description: 'База хранит стратегии, свечи, запуски, сделки и точки кривой капитала.',
    responsibilities: ['candles', 'runs', 'backtest_trades', 'backtest_equity_points'],
    details: ['OHLCV storage', 'Run artifacts', 'Relational links by run_id'],
    icon: Database,
    skillIcon: 'postgresql',
  },
]

export const dataFlowSteps: FlowStep[] = [
  {
    title: 'POST /backtests',
    description: 'Клиент передает стратегию, рынок, interval, период, параметры и настройки исполнения.',
  },
  {
    title: 'Validate request',
    description: 'Backend проверяет стратегию, временной диапазон, параметры капитала, комиссии и доступность данных.',
  },
  {
    title: 'PENDING -> RUNNING',
    description: 'Java создает запись в runs, затем BacktestService переводит запуск в RUNNING.',
  },
  {
    title: 'OHLCV -> CSV',
    description: 'Сервис читает candles по exchange, symbol, interval, from и to, затем готовит временный CSV.',
  },
  {
    title: 'Python process',
    description: 'PythonBacktestExecutor передает JSON через stdin и читает stdout/stderr.',
  },
  {
    title: 'Strategy execution',
    description: 'Python engine применяет стратегию к подготовленным свечам, считает сделки, PnL, комиссии и equity.',
  },
  {
    title: 'Persist artifacts',
    description: 'summary сохраняется в metrics_json, сделки в backtest_trades, equity в backtest_equity_points.',
  },
  {
    title: 'COMPLETED / FAILED',
    description: 'Успешный запуск завершается COMPLETED, ошибка подготовки или исполнения сохраняется как FAILED.',
  },
]

export const quickStartSnippet = `git clone https://github.com/Trade360Lab/Trade360Lab.git
cd Trade360Lab
docker compose up --build`

export const backtestStatuses: BacktestStatus[] = [
  {
    status: 'PENDING',
    tone: 'idle',
    description: 'Запуск создан, но выполнение еще не началось.',
  },
  {
    status: 'RUNNING',
    tone: 'active',
    description: 'Java backend подготовил данные и выполняет Python-бэктест.',
  },
  {
    status: 'COMPLETED',
    tone: 'success',
    description: 'Python завершился успешно, summary и артефакты сохранены в БД.',
  },
  {
    status: 'FAILED',
    tone: 'danger',
    description: 'Ошибка возникла во время подготовки данных, выполнения Python или сохранения результата.',
  },
]

export const apiMethods: ApiMethodOption[] = [
  { id: 'GET', label: 'GET' },
  { id: 'POST', label: 'POST' },
  { id: 'PUT/PATCH', label: 'PUT/PATCH' },
  { id: 'DELETE', label: 'DELETE' },
]

export const endpoints: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Регистрирует пользователя и возвращает JWT.',
    source: 'AuthController.java',
    request: `{
  "email": "user@example.com",
  "password": "secret123",
  "displayName": "Researcher"
}`,
    response: `{
  "token": "jwt-token",
  "userId": 1,
  "email": "user@example.com"
}`,
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Аутентифицирует пользователя и возвращает JWT.',
    source: 'AuthController.java',
    request: `{
  "email": "user@example.com",
  "password": "secret123"
}`,
    response: `{
  "token": "jwt-token",
  "userId": 1,
  "email": "user@example.com"
}`,
  },
  {
    method: 'GET',
    path: '/api/health',
    description: 'Проверяет состояние Java API.',
    source: 'HealthController.java',
    response: `{
  "status": "UP",
  "service": "java-api"
}`,
  },
  {
    method: 'GET',
    path: '/api/python/health',
    description: 'Проверяет доступность Python parser/backtesting service.',
    source: 'HealthController.java',
    response: `{
  "status": "UP",
  "python": true
}`,
  },
  {
    method: 'GET',
    path: '/api/candles',
    description: 'Возвращает OHLCV свечи по exchange, symbol, interval и временному диапазону.',
    source: 'CandleController.java',
    response: `[{
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "openTime": "2024-01-01T00:00:00Z",
  "close": 43120.5
}]`,
  },
  {
    method: 'POST',
    path: '/api/imports/candles',
    description: 'Импортирует свечи через Python parser и сохраняет dataset/snapshot.',
    source: 'ImportController.java',
    request: `{
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "from": "2024-01-01T00:00:00Z",
  "to": "2024-01-03T00:00:00Z"
}`,
    response: `{
  "datasetId": 12,
  "snapshotId": 34,
  "rowsImported": 48
}`,
  },
  {
    method: 'POST',
    path: '/backtests',
    description: 'Создает запуск и синхронно выполняет бэктест.',
    source: 'docs/api.md',
    request: `{
  "strategyId": 42,
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "from": "2024-01-01T00:00:00Z",
  "to": "2024-01-03T00:00:00Z",
  "params": {
    "fastPeriod": 10,
    "slowPeriod": 21
  },
  "initialCash": 10000.0,
  "feeRate": 0.001,
  "slippageBps": 5.0,
  "strictData": true
}`,
    response: `{
  "runId": 101
}`,
  },
  {
    method: 'GET',
    path: '/backtests/{id}',
    description: 'Возвращает состояние запуска, summary, ошибку и timestamps.',
    source: 'docs/api.md',
    response: `{
  "runId": 101,
  "strategyId": 42,
  "status": "COMPLETED",
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "summary": {
    "profit": 12.5,
    "sharpe": 1.3
  },
  "errorMessage": null
}`,
  },
  {
    method: 'GET',
    path: '/backtests/{id}/trades',
    description: 'Возвращает сделки конкретного запуска.',
    source: 'docs/api.md',
    response: `[{
  "entry_time": "2024-01-01T00:00:00Z",
  "exit_time": "2024-01-01T01:00:00Z",
  "entry_price": 100.0,
  "exit_price": 109.5,
  "qty": 1.0,
  "pnl": 9.5,
  "fee": 0.2
}]`,
  },
  {
    method: 'GET',
    path: '/backtests/{id}/equity',
    description: 'Возвращает кривую капитала.',
    source: 'docs/api.md',
    response: `[{
  "timestamp": "2024-01-01T01:00:00Z",
  "equity": 10009.5
}]`,
  },
  {
    method: 'GET',
    path: '/api/runs',
    description: 'Возвращает последние runs текущего пользователя.',
    source: 'RunController.java',
    response: `[{
  "id": 101,
  "status": "COMPLETED",
  "symbol": "BTCUSDT"
}]`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}',
    description: 'Возвращает один run текущего пользователя.',
    source: 'RunController.java',
    response: `{
  "id": 101,
  "status": "COMPLETED",
  "strategyId": 42
}`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}/result',
    description: 'Возвращает итоговый результат run.',
    source: 'RunController.java',
    response: `{
  "runId": 101,
  "metrics": {
    "netProfit": 12.5
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}/execution',
    description: 'Возвращает latest execution job для запуска.',
    source: 'RunController.java',
    response: `{
  "id": 501,
  "runId": 101,
  "status": "SUCCEEDED"
}`,
  },
  {
    method: 'POST',
    path: '/api/runs',
    description: 'Создает Run, snapshot и ExecutionJob со статусом QUEUED.',
    source: 'docs/api.md',
    request: `{
  "strategyId": 42,
  "strategyVersionId": 101,
  "parameterPresetId": 7,
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h",
  "from": "2024-01-01T00:00:00Z",
  "to": "2024-01-03T00:00:00Z",
  "params": {
    "fastPeriod": 10
  }
}`,
    response: `{
  "id": 101,
  "status": "QUEUED",
  "executionJobId": 501
}`,
  },
  {
    method: 'POST',
    path: '/api/runs/{id}/rerun',
    description: 'Создает повторный запуск на основе существующего run.',
    source: 'RunController.java',
    response: `{
  "id": 102,
  "status": "QUEUED"
}`,
  },
  {
    method: 'POST',
    path: '/api/runs/{id}/retry',
    description: 'Повторно ставит failed execution job в очередь.',
    source: 'RunController.java',
    response: `{
  "id": 502,
  "status": "QUEUED",
  "attempt": 2
}`,
  },
  {
    method: 'POST',
    path: '/api/runs/{id}/cancel',
    description: 'Отменяет queued/running execution job.',
    source: 'RunController.java',
    response: `{
  "runId": 101,
  "status": "CANCEL_REQUESTED"
}`,
  },
  {
    method: 'GET',
    path: '/api/execution-jobs',
    description: 'Возвращает execution jobs текущего пользователя.',
    source: 'ExecutionJobController.java',
    response: `[{
  "id": 501,
  "runId": 101,
  "status": "SUCCEEDED"
}]`,
  },
  {
    method: 'GET',
    path: '/api/execution-jobs/{id}',
    description: 'Возвращает execution job по id.',
    source: 'ExecutionJobController.java',
    response: `{
  "id": 501,
  "status": "SUCCEEDED",
  "attempt": 1
}`,
  },
  {
    method: 'POST',
    path: '/api/strategies',
    description: 'Создает draft strategy registry record.',
    source: 'StrategyFileController.java',
    request: `{
  "name": "Mean Reversion",
  "description": "Demo strategy",
  "strategyType": "PYTHON"
}`,
    response: `{
  "id": 42,
  "name": "Mean Reversion",
  "lifecycleStatus": "DRAFT"
}`,
  },
  {
    method: 'POST',
    path: '/api/strategies/upload',
    description: 'Загружает .py стратегию и создает initial immutable version.',
    source: 'StrategyFileController.java',
    request: `multipart/form-data:
file=strategy.py
name=Mean Reversion`,
    response: `{
  "strategyId": 42,
  "versionId": 101,
  "validationStatus": "VALID"
}`,
  },
  {
    method: 'GET',
    path: '/api/strategies',
    description: 'Возвращает стратегии текущего пользователя.',
    source: 'StrategyFileController.java',
    response: `[{
  "id": 42,
  "name": "Mean Reversion",
  "lifecycleStatus": "ACTIVE"
}]`,
  },
  {
    method: 'GET',
    path: '/api/strategies/{id}',
    description: 'Возвращает одну owned strategy.',
    source: 'StrategyFileController.java',
    response: `{
  "id": 42,
  "name": "Mean Reversion",
  "tags": ["btc", "1h"]
}`,
  },
  {
    method: 'PUT/PATCH',
    path: '/api/strategies/{id}',
    description: 'Обновляет metadata стратегии.',
    source: 'StrategyFileController.java',
    request: `{
  "name": "Mean Reversion v2",
  "tags": ["btc", "research"]
}`,
    response: `{
  "id": 42,
  "name": "Mean Reversion v2"
}`,
  },
  {
    method: 'POST',
    path: '/api/strategies/{id}/archive',
    description: 'Переводит strategy lifecycle в ARCHIVED.',
    source: 'StrategyFileController.java',
    response: `{
  "id": 42,
  "lifecycleStatus": "ARCHIVED"
}`,
  },
  {
    method: 'POST',
    path: '/api/strategies/{id}/versions',
    description: 'Загружает новую immutable strategy version.',
    source: 'StrategyFileController.java',
    request: `multipart/form-data:
file=strategy_v2.py`,
    response: `{
  "versionId": 102,
  "validationStatus": "PENDING"
}`,
  },
  {
    method: 'GET',
    path: '/api/strategies/{id}/versions',
    description: 'Возвращает version history стратегии.',
    source: 'StrategyFileController.java',
    response: `[{
  "id": 101,
  "version": 1,
  "validationStatus": "VALID"
}]`,
  },
  {
    method: 'GET',
    path: '/api/strategy-versions/{versionId}',
    description: 'Возвращает одну owned strategy version.',
    source: 'StrategyFileController.java',
    response: `{
  "id": 101,
  "strategyId": 42,
  "checksum": "sha256:..."
}`,
  },
  {
    method: 'POST',
    path: '/api/strategy-versions/{versionId}/validate',
    description: 'Повторно запускает validation contract.',
    source: 'StrategyFileController.java',
    response: `{
  "versionId": 101,
  "validationStatus": "VALID"
}`,
  },
  {
    method: 'POST',
    path: '/api/strategy-versions/{versionId}/activate',
    description: 'Активирует VALID/WARNING версию стратегии.',
    source: 'StrategyFileController.java',
    response: `{
  "versionId": 101,
  "active": true
}`,
  },
  {
    method: 'GET',
    path: '/api/strategy-templates',
    description: 'Возвращает system-owned starter templates.',
    source: 'StrategyTemplateController.java',
    response: `[{
  "id": 1,
  "name": "Moving Average Crossover"
}]`,
  },
  {
    method: 'GET',
    path: '/api/strategy-templates/{id}',
    description: 'Возвращает один starter template.',
    source: 'StrategyTemplateController.java',
    response: `{
  "id": 1,
  "name": "Moving Average Crossover",
  "source": "class Strategy: ..."
}`,
  },
  {
    method: 'POST',
    path: '/api/strategies/{id}/presets',
    description: 'Создает parameter preset для стратегии.',
    source: 'StrategyFileController.java',
    request: `{
  "name": "BTC 1h default",
  "presetPayload": {
    "fastPeriod": 10,
    "slowPeriod": 21
  }
}`,
    response: `{
  "id": 7,
  "name": "BTC 1h default"
}`,
  },
  {
    method: 'GET',
    path: '/api/strategies/{id}/presets',
    description: 'Возвращает presets owned user для strategy.',
    source: 'StrategyFileController.java',
    response: `[{
  "id": 7,
  "name": "BTC 1h default"
}]`,
  },
  {
    method: 'PUT/PATCH',
    path: '/api/strategy-presets/{presetId}',
    description: 'Обновляет preset name/payload.',
    source: 'StrategyFileController.java',
    request: `{
  "name": "BTC 1h aggressive",
  "presetPayload": {
    "fastPeriod": 8
  }
}`,
    response: `{
  "id": 7,
  "name": "BTC 1h aggressive"
}`,
  },
  {
    method: 'DELETE',
    path: '/api/strategy-presets/{presetId}',
    description: 'Удаляет owned parameter preset.',
    source: 'StrategyFileController.java',
    response: `{
  "deleted": true
}`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}/artifacts',
    description: 'Возвращает metadata артефактов запуска.',
    source: 'RunArtifactController.java',
    response: `[{
  "id": 900,
  "type": "EQUITY_CURVE",
  "filename": "equity.json"
}]`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}/artifacts/{artifactId}',
    description: 'Возвращает metadata и JSON payload артефакта.',
    source: 'RunArtifactController.java',
    response: `{
  "id": 900,
  "payload": {
    "points": []
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/runs/{id}/artifacts/{artifactId}/download',
    description: 'Возвращает артефакт как downloadable file.',
    source: 'RunArtifactController.java',
    response: `{
  "filename": "equity.json",
  "contentType": "application/json"
}`,
  },
  {
    method: 'GET',
    path: '/api/datasets',
    description: 'Возвращает datasets текущего пользователя.',
    source: 'DatasetController.java',
    response: `[{
  "id": 12,
  "name": "BTCUSDT 1h",
  "symbol": "BTCUSDT"
}]`,
  },
  {
    method: 'GET',
    path: '/api/datasets/{id}',
    description: 'Возвращает dataset payload, latest snapshot и latest quality report.',
    source: 'DatasetController.java',
    response: `{
  "id": 12,
  "name": "BTCUSDT 1h",
  "latestSnapshotId": 34
}`,
  },
  {
    method: 'GET',
    path: '/api/datasets/{id}/versions',
    description: 'Возвращает snapshot/version history dataset.',
    source: 'DatasetController.java',
    response: `[{
  "id": 34,
  "version": 1,
  "rowCount": 48
}]`,
  },
  {
    method: 'GET',
    path: '/api/datasets/{id}/quality',
    description: 'Возвращает quality reports dataset.',
    source: 'DatasetController.java',
    response: `[{
  "id": 77,
  "status": "PASSED",
  "missingRows": 0
}]`,
  },
  {
    method: 'POST',
    path: '/api/datasets',
    description: 'Создает dataset metadata.',
    source: 'DatasetController.java',
    request: `{
  "name": "BTCUSDT 1h",
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "interval": "1h"
}`,
    response: `{
  "id": 12,
  "name": "BTCUSDT 1h"
}`,
  },
  {
    method: 'PUT/PATCH',
    path: '/api/datasets/{id}',
    description: 'Переименовывает owned dataset.',
    source: 'DatasetController.java',
    request: `{
  "name": "BTCUSDT 1h research"
}`,
    response: `{
  "id": 12,
  "name": "BTCUSDT 1h research"
}`,
  },
  {
    method: 'POST',
    path: '/api/datasets/{id}/duplicate',
    description: 'Создает копию dataset для текущего пользователя.',
    source: 'DatasetController.java',
    response: `{
  "id": 13,
  "sourceDatasetId": 12
}`,
  },
  {
    method: 'DELETE',
    path: '/api/datasets/{id}',
    description: 'Удаляет owned dataset.',
    source: 'DatasetController.java',
    response: `{
  "deleted": true
}`,
  },
  {
    method: 'GET',
    path: '/api/dataset-snapshots/{snapshotId}',
    description: 'Возвращает metadata dataset snapshot.',
    source: 'DatasetSnapshotController.java',
    response: `{
  "id": 34,
  "datasetId": 12,
  "version": 1
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/sessions',
    description: 'Создает paper trading session со статусом CREATED.',
    source: 'PaperTradingController.java',
    request: `{
  "name": "BTC paper",
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "initialBalance": 10000,
  "baseCurrency": "BTC",
  "quoteCurrency": "USDT"
}`,
    response: `{
  "id": 31,
  "status": "CREATED"
}`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions',
    description: 'Возвращает paper sessions текущего пользователя.',
    source: 'PaperTradingController.java',
    response: `[{
  "id": 31,
  "name": "BTC paper",
  "status": "RUNNING"
}]`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions/{id}',
    description: 'Возвращает одну owned paper session.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 31,
  "status": "RUNNING",
  "symbol": "BTCUSDT"
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/sessions/{id}/start',
    description: 'Переводит paper session в RUNNING.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 31,
  "status": "RUNNING"
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/sessions/{id}/pause',
    description: 'Переводит running session в PAUSED.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 31,
  "status": "PAUSED"
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/sessions/{id}/stop',
    description: 'Переводит session в STOPPED.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 31,
  "status": "STOPPED"
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/sessions/{id}/orders',
    description: 'Создает simulated market/limit order.',
    source: 'PaperTradingController.java',
    request: `{
  "side": "BUY",
  "type": "MARKET",
  "quantity": 0.01
}`,
    response: `{
  "id": 701,
  "status": "FILLED",
  "side": "BUY"
}`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions/{id}/orders',
    description: 'Возвращает orders для owned session.',
    source: 'PaperTradingController.java',
    response: `[{
  "id": 701,
  "status": "FILLED",
  "quantity": 0.01
}]`,
  },
  {
    method: 'GET',
    path: '/api/paper/orders/{orderId}',
    description: 'Возвращает один owned paper order.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 701,
  "status": "FILLED",
  "price": 60000
}`,
  },
  {
    method: 'POST',
    path: '/api/paper/orders/{orderId}/cancel',
    description: 'Отменяет NEW или ACCEPTED paper order.',
    source: 'PaperTradingController.java',
    response: `{
  "id": 701,
  "status": "CANCELLED"
}`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions/{id}/positions',
    description: 'Возвращает paper positions для owned session.',
    source: 'PaperTradingController.java',
    response: `[{
  "symbol": "BTCUSDT",
  "quantity": 0.01,
  "unrealizedPnl": 12.5
}]`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions/{id}/fills',
    description: 'Возвращает simulated fills для owned session.',
    source: 'PaperTradingController.java',
    response: `[{
  "orderId": 701,
  "price": 60000,
  "quantity": 0.01
}]`,
  },
  {
    method: 'GET',
    path: '/api/paper/sessions/{id}/summary',
    description: 'Возвращает баланс, PnL, equity и счетчики paper session.',
    source: 'PaperTradingController.java',
    response: `{
  "balance": 9998.5,
  "equity": 10012.5,
  "openPositionCount": 1
}`,
  },
  {
    method: 'GET',
    path: '/api/telegram/status',
    description: 'Возвращает статус Telegram bot integration.',
    source: 'TelegramBotController.java',
    response: `{
  "enabled": true,
  "status": "READY"
}`,
  },
]

export const errorResponseSnippet = `{
  "timestamp": "2024-01-01T00:00:05Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Field 'from' must be before 'to'",
  "path": "/backtests"
}`

export const dataEntities: DataEntity[] = [
  {
    name: 'runs',
    description: 'Главная таблица запусков и их lifecycle.',
    fields: ['id', 'strategy_id', 'status', 'exchange', 'symbol', 'interval', 'date_from', 'date_to', 'params_json', 'metrics_json', 'error_message', 'created_at', 'started_at', 'finished_at'],
    notes: ['Идентичность и статус запуска.', 'Запрос в params_json.', 'Summary результата в metrics_json.', 'Текст ошибки в error_message.'],
    details: [
      { label: 'Роль', value: 'центр агрегации: к нему привязаны сделки, equity curve, параметры и итоговые метрики' },
      { label: 'Статусы', value: 'PENDING, RUNNING, COMPLETED, FAILED' },
      { label: 'JSON', value: 'params_json хранит входные параметры, metrics_json хранит итоговый summary' },
    ],
  },
  {
    name: 'backtest_trades',
    description: 'Сделки конкретного запуска.',
    fields: ['id', 'run_id', 'entry_time', 'exit_time', 'entry_price', 'exit_price', 'quantity', 'pnl', 'fee'],
    notes: ['run_id -> runs.id.'],
    details: [
      { label: 'Назначение', value: 'детализация входа и выхода из позиции для последующего анализа результата' },
      { label: 'Расчет', value: 'pnl и fee приходят из Python engine и сохраняются как артефакт запуска' },
      { label: 'Связь', value: 'каждая сделка принадлежит одному run и очищается вместе с ним на уровне сервиса' },
    ],
  },
  {
    name: 'backtest_equity_points',
    description: 'Точки кривой капитала.',
    fields: ['id', 'run_id', 'timestamp', 'equity'],
    notes: ['run_id -> runs.id.'],
    details: [
      { label: 'Назначение', value: 'построение equity curve и сравнение динамики капитала между запусками' },
      { label: 'Гранулярность', value: 'timestamp соответствует времени точки, рассчитанной движком бэктеста' },
      { label: 'Потребитель', value: 'frontend использует массив точек для графиков и визуального сравнения' },
    ],
  },
  {
    name: 'candles',
    description: 'OHLCV-данные, из которых выполняется бэктест.',
    fields: ['exchange', 'symbol', 'interval', 'open_time', 'close_time', 'open', 'high', 'low', 'close', 'volume'],
    notes: ['BacktestService читает исходные свечи из этой таблицы.'],
    details: [
      { label: 'Источник', value: 'рыночные OHLCV-данные по exchange, symbol и interval' },
      { label: 'Фильтр', value: 'Java API выбирает диапазон open_time между from и to перед передачей в Python' },
      { label: 'Строгость', value: 'strictData позволяет остановить запуск при недостаточных или некорректных данных' },
    ],
  },
]

export const launchGuide: LaunchGroup[] = [
  {
    title: 'Вариант A',
    items: ['Весь стек в Docker', 'Рекомендуемый быстрый старт из README', 'Одна команда поднимает frontend, Java API, Python service и PostgreSQL'],
  },
  {
    title: 'Вариант B',
    items: ['Локальная разработка по сервисам', 'Frontend запускается отдельно', 'Python parser и Java API стартуют из своих каталогов'],
  },
]

export const launchPorts: LaunchPort[] = [
  { service: 'Frontend', url: 'http://localhost:3000', env: 'FRONTEND_HOST_PORT' },
  { service: 'Java API', url: 'http://localhost:18080', env: 'JAVA_API_HOST_PORT' },
  { service: 'Python parser', url: 'http://localhost:18000', env: 'PYTHON_PARSER_HOST_PORT' },
  { service: 'PostgreSQL', url: 'localhost:55432', env: 'POSTGRES_HOST_PORT' },
]

export const launchLocalServices: LaunchLocalService[] = [
  {
    title: 'Frontend',
    path: 'frontend',
    command: 'npm install && npm run dev',
    detail: 'Next.js интерфейс, workspace, data screen, backtests, cards и compare.',
  },
  {
    title: 'Python parser',
    path: 'backend/python',
    command: 'uvicorn parser.main:app --host 0.0.0.0 --port 8000',
    detail: 'Parser/import и backtesting service после установки requirements.txt в virtualenv.',
  },
  {
    title: 'Java API',
    path: 'backend/java',
    command: 'mvn spring-boot:run',
    detail: 'Spring Boot слой REST API, lifecycle запусков и интеграция с PostgreSQL/Python.',
  },
]

export const qualityCommands = `docker compose up --build

# services:
# frontend:      http://localhost:3000
# java api:      http://localhost:18080
# python parser: http://localhost:18000
# postgresql:    localhost:55432`

export const runtimeCommands = `cd frontend
npm install
npm run dev

cd ../backend/python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn parser.main:app --host 0.0.0.0 --port 8000

cd ../java
mvn spring-boot:run`

export const statusIcons = {
  idle: CircleDashed,
  active: TerminalSquare,
  success: CheckCircle2,
  danger: ShieldAlert,
} as const

export const repositoryTree = `Project/
|-- frontend/               # Next.js UI + API proxy
|-- backend/
|   |-- java/               # Spring Boot API
|   \`-- python/             # FastAPI parser/import
|-- docs/                   # проектная документация
|-- .github/workflows/      # CI pipeline
\`-- docker-compose.yml      # запуск всего стека`

export const systemFlow = [
  {
    title: 'Frontend',
    detail: 'UI отправляет параметры стратегии, рынка и периода',
  },
  {
    title: 'Java backend',
    detail: 'создает run, валидирует запрос и читает candles',
  },
  {
    title: 'Python engine',
    detail: 'исполняет стратегию и рассчитывает сделки',
  },
  {
    title: 'JSON artifacts',
    detail: 'возвращает summary, trades и equity curve',
  },
]
