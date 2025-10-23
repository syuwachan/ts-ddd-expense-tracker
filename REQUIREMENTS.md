# 要件定義書
## TypeScript DDD Expense Tracker

**作成日**: 2025-10-23
**バージョン**: 1.0
**ステータス**: Draft

---

## 1. プロジェクト概要

### 1.1 目的
個人の収支を管理し、予算計画・目標設定・資産シミュレーションを通じて、ユーザーの財務健全性を向上させるWebアプリケーションを提供する。

### 1.2 ターゲットユーザー
- 個人で家計簿を管理したい方
- 月次・年次での支出傾向を把握したい方
- 貯蓄目標を設定し、達成までの計画を立てたい方
- 将来の資産形成をシミュレーションしたい方

### 1.3 技術スタック
- **フロントエンド**: Next.js 16, React 19, TypeScript 5
- **状態管理**: Zustand 5
- **スタイリング**: Tailwind CSS 4
- **チャート**: Chart.js 4.5 + react-chartjs-2
- **アイコン**: Lucide React
- **アーキテクチャ**: Domain-Driven Design (DDD)
- **データ永続化**: LocalStorage（Phase 1）、PostgreSQL（Phase 2）

---

## 2. 機能要件

### 2.1 収支記録機能

#### FR-001: 収入の記録
- **優先度**: 高
- **概要**: ユーザーが収入を記録できる
- **入力項目**:
  - 金額（必須、正の整数）
  - カテゴリー（必須、選択式）
    - Salary（給与）
    - Bonus（ボーナス）
    - Investment（投資）
    - Gift（贈与）
    - Other（その他）
  - 日付（必須、YYYY-MM-DD形式）
  - メモ（任意、テキスト）
- **検証**:
  - 金額は1円以上
  - 日付は有効な日付形式
  - カテゴリーは定義済みの値のみ
- **保存先**: LocalStorage → 将来的にDB

#### FR-002: 支出の記録
- **優先度**: 高
- **概要**: ユーザーが支出を記録できる
- **入力項目**:
  - 金額（必須、正の整数）
  - カテゴリー（必須、選択式）
    - Food（食費）
    - Transport（交通費）
    - Housing（住居費）
    - Entertainment（娯楽費）
    - Other（その他）
  - 日付（必須、YYYY-MM-DD形式）
  - メモ（任意、テキスト）
- **検証**:
  - 金額は1円以上
  - 日付は有効な日付形式
  - カテゴリーは定義済みの値のみ
- **保存先**: LocalStorage → 将来的にDB

#### FR-003: 収支の編集
- **優先度**: 高
- **概要**: 既存の収入・支出レコードを編集できる
- **操作**:
  - レコード一覧から編集対象を選択
  - モーダルで編集フォームを表示
  - 全項目を変更可能
  - 保存時に更新日時を記録
- **制約**:
  - IDは変更不可
  - 検証ルールはFR-001/FR-002と同じ

#### FR-004: 収支の削除
- **優先度**: 高
- **概要**: 既存の収入・支出レコードを削除できる
- **操作**:
  - レコード一覧から削除対象を選択
  - 確認ダイアログを表示
  - 削除実行後、一覧から除外
- **制約**:
  - 削除は論理削除（将来的にソフトデリート）
  - 削除後は復元不可（Phase 1）

#### FR-005: 収支記録モーダル
- **優先度**: 高
- **概要**: ダッシュボードの「+ Record」ボタンからモーダルを開く
- **UI要件**:
  - 背景はブラー + 半透明オーバーレイ
  - モーダルはふわっとスケールインアニメーション
  - 収入/支出タイプをトグルで切り替え
  - カテゴリーはタイプに応じて動的に変更
  - キャンセル・保存ボタン
  - ×ボタンまたは背景クリックで閉じる

---

### 2.2 データ表示機能

#### FR-101: ダッシュボード
- **優先度**: 高
- **概要**: 財務状況の概要を一目で把握できる画面
- **表示内容**:
  - **サマリーカード**:
    - 総資産残高（収入合計 - 支出合計）
    - 貯蓄率（(収入-支出)/収入 × 100）
    - + Recordボタン
  - **予算トラッカー**:
    - カテゴリー別予算 vs 実績
    - プログレスバーで視覚化
    - 各カテゴリーの金額と割合
  - **支出トレンド**:
    - 月次支出の折れ線グラフ（過去7ヶ月）
    - グラデーション面グラフ
  - **最新の収支リスト**:
    - 最新10件の収入・支出を表示
- **データソース**: Zustandストアから取得
- **更新頻度**: リアルタイム（レコード追加/編集/削除時）

#### FR-102: トランザクション一覧ページ
- **優先度**: 高
- **概要**: 全ての収支レコードを一覧表示し、フィルタリング可能
- **表示内容**:
  - サマリーカード（総収入・総支出・純利益）
  - フィルター機能:
    - タイプ（All / Income / Expense）
    - カテゴリー（ドロップダウン）
  - テーブル表示:
    - 列: 日付、カテゴリー、説明、タイプ、金額
    - ソート機能（日付降順がデフォルト）
    - ホバーで行をハイライト
  - 各行に編集・削除ボタン（Phase 1.5）
- **ページネーション**: 将来実装（Phase 2）
- **データソース**: Zustandストアから取得

#### FR-103: チャートページ
- **優先度**: 中
- **概要**: 複数のグラフで財務データを視覚化
- **表示チャート**:
  1. **収入 vs 支出トレンド**（折れ線グラフ）
     - 過去7ヶ月の推移
     - 2系列（収入・支出）
  2. **カテゴリー別支出**（棒グラフ）
     - 今月の支出をカテゴリー別に集計
  3. **カテゴリー分布**（ドーナツチャート）
     - 今月の支出割合
  4. **収入配分**（パイチャート）
     - 収入・支出・貯蓄の割合
- **インタラクション**:
  - ツールチップで詳細表示
  - 凡例クリックで表示/非表示切り替え
- **データソース**: Zustandストアから動的生成

#### FR-104: レポートページ
- **優先度**: 中
- **概要**: 月次・年次レポートとインサイトを表示
- **表示内容**:
  - **月選択**: 月ピッカーで対象月を選択
  - **月次サマリー**:
    - 総収入・総支出・純貯蓄・貯蓄率
    - 前月比（増減率）
  - **インサイト & レコメンデーション**:
    - 支出削減成功の通知
    - 予算超過の警告
    - 貯蓄率の評価
  - **トップ支出カテゴリー**:
    - 上位5カテゴリーをプログレスバーで表示
  - **年次概要**:
    - YTD（年初来）の収入・支出・貯蓄
    - 平均月次貯蓄
    - ベスト・ワースト月
  - **エクスポートボタン**（Phase 2）:
    - PDF・Excel・CSV出力
- **データソース**: Zustandストアから集計

---

### 2.3 予算管理機能

#### FR-201: 予算設定
- **優先度**: 中
- **概要**: カテゴリー別に月次予算を設定できる
- **入力項目**:
  - カテゴリー（必須）
  - 月次予算額（必須、正の整数）
  - 有効期間（開始月、終了月）
- **検証**:
  - 予算額は0円以上
  - 終了月は開始月以降
- **保存先**: LocalStorage → 将来的にDB
- **実装**: Phase 1.5（ドメイン層にBudgetエンティティ追加）

#### FR-202: 予算 vs 実績表示
- **優先度**: 中
- **概要**: 設定した予算と実際の支出を比較表示
- **表示内容**:
  - カテゴリー別の予算額・実績額・残額
  - 達成率（実績/予算 × 100）
  - プログレスバー（100%超で赤色表示）
- **配置**: ダッシュボードのBudgetTrackerコンポーネント
- **データソース**: 予算設定 + 支出レコード

#### FR-203: 予算超過アラート
- **優先度**: 低
- **概要**: 予算の80%・100%到達時に通知
- **通知方法**:
  - ダッシュボードにバッジ表示
  - レポートページのインサイト欄に警告
- **実装**: Phase 2

---

### 2.4 目標管理・シミュレーション機能

#### FR-301: 財務目標設定
- **優先度**: 中
- **概要**: 貯蓄目標を設定・管理できる
- **入力項目**:
  - 月次収入目標
  - 月次支出目標
  - 貯蓄目標額
  - 目標達成期限
- **表示内容**:
  - 期待月次貯蓄額
  - 貯蓄率
- **保存先**: LocalStorage → 将来的にDB
- **配置**: Simulationページ

#### FR-302: 資産シミュレーション
- **優先度**: 中
- **概要**: 将来の資産推移をシミュレーション
- **入力項目**:
  - 現在の資産
  - 月次積立額
  - 年間利回り（%）
  - シミュレーション期間（年）
- **計算ロジック**:
  - 複利計算（月次複利）
  - 毎月の積立を考慮
- **表示内容**:
  - 折れ線グラフで資産推移を表示
  - 開始金額・総積立額・最終予想額
  - 投資利益・総利回り
- **配置**: Simulationページ

#### FR-303: 目標達成タイムライン
- **優先度**: 中
- **概要**: 貯蓄目標達成までの期間を計算
- **表示内容**:
  - 目標金額
  - 達成までの期間（年・月）
  - 現在の進捗率（プログレスバー）
  - 月次貯蓄必要額
  - 追加貯蓄による短縮シミュレーション
- **配置**: Simulationページ

---

### 2.5 検索・フィルタリング機能

#### FR-401: カテゴリーフィルター
- **優先度**: 高
- **概要**: トランザクション一覧をカテゴリーで絞り込み
- **実装状況**: ✅ 実装済み（Transactionsページ）
- **拡張**: チャート・レポートページにも適用（Phase 1.5）

#### FR-402: 日付範囲フィルター
- **優先度**: 中
- **概要**: 開始日〜終了日で期間指定検索
- **入力**: DatePickerまたはカレンダーUI
- **実装**: Phase 1.5

#### FR-403: 金額範囲フィルター
- **優先度**: 低
- **概要**: 最小金額〜最大金額で検索
- **実装**: Phase 2

#### FR-404: メモ検索
- **優先度**: 低
- **概要**: メモ（説明）に含まれるキーワードで検索
- **実装**: Phase 2

---

### 2.6 データエクスポート機能

#### FR-501: CSV出力
- **優先度**: 低
- **概要**: トランザクションデータをCSV形式で出力
- **出力項目**: ID, 日付, タイプ, カテゴリー, 金額, メモ
- **実装**: Phase 2

#### FR-502: PDF出力
- **優先度**: 低
- **概要**: 月次レポートをPDF形式で出力
- **実装**: Phase 2

#### FR-503: Excel出力
- **優先度**: 低
- **概要**: トランザクションデータをExcel形式で出力
- **実装**: Phase 2

---

## 3. 非機能要件

### 3.1 パフォーマンス要件

#### NFR-001: ページ読み込み速度
- 初期ページ読み込み: 2秒以内
- ページ遷移: 500ms以内
- モーダル表示: 300ms以内（アニメーション含む）

#### NFR-002: レスポンシブデザイン
- 対応デバイス: デスクトップ、タブレット、スマートフォン
- ブレークポイント: Tailwind CSSデフォルト（sm: 640px, md: 768px, lg: 1024px）
- **実装状況**: Phase 2（現在はデスクトップ優先）

#### NFR-003: データ処理速度
- 1000件のトランザクション処理: 100ms以内
- グラフ描画: 200ms以内

---

### 3.2 セキュリティ要件

#### NFR-101: データ保護
- LocalStorage使用時: ブラウザのセキュリティに依存
- 将来的にDB移行時: HTTPS必須、XSS/CSRF対策

#### NFR-102: 入力検証
- クライアントサイド: React Hook Formまたは手動バリデーション
- サーバーサイド: ドメイン層のValue Objectで検証
- SQLインジェクション対策: ORMの使用（Phase 2）

#### NFR-103: 認証・認可
- Phase 1: 認証なし（シングルユーザー）
- Phase 2: JWT認証、セッション管理

---

### 3.3 ユーザビリティ要件

#### NFR-201: アクセシビリティ
- WCAG 2.1 レベルAA準拠（Phase 2）
- キーボードナビゲーション対応
- スクリーンリーダー対応

#### NFR-202: 多言語対応
- Phase 1: 英語のみ
- Phase 2: 日本語、英語（i18n）

#### NFR-203: エラーメッセージ
- ユーザーフレンドリーなエラー表示
- 具体的な修正方法を提示
- トースト通知またはインラインエラー

---

### 3.4 保守性要件

#### NFR-301: コードアーキテクチャ
- Domain-Driven Design (DDD)の厳密な適用
- レイヤー分離: Domain / Application / Infrastructure / Presentation
- 依存性逆転の原則（DIP）

#### NFR-302: テストカバレッジ
- Phase 2目標: 80%以上
- 単体テスト: Jest
- E2Eテスト: Playwright

#### NFR-303: ドキュメンテーション
- コードコメント: TSDocスタイル
- README.md: セットアップ手順、アーキテクチャ概要
- API仕様書: OpenAPI 3.0（Phase 2）

---

## 4. データモデル

### 4.1 エンティティ

#### Expense（支出）
```typescript
{
  id: string;          // UUID
  amount: Money;       // Value Object
  category: ExpenseCategoryType; // Value Object
  date: DateValue;     // Value Object
  memo: Memo;          // Value Object
  createdAt: Date;
  updatedAt: Date;
}
```

#### Income（収入）
```typescript
{
  id: string;
  amount: Money;
  category: IncomeCategoryType;
  date: DateValue;
  memo: Memo;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Budget（予算）- Phase 1.5
```typescript
{
  id: string;
  category: ExpenseCategoryType;
  monthlyLimit: Money;
  startMonth: string;  // YYYY-MM
  endMonth: string;    // YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}
```

#### SavingsGoal（貯蓄目標）- Phase 1.5
```typescript
{
  id: string;
  targetAmount: Money;
  deadline: DateValue;
  monthlyIncomeGoal: Money;
  monthlyExpenseGoal: Money;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 4.2 Value Objects

#### Money
- 金額を表現（円単位）
- バリデーション: 0以上の整数
- メソッド: add, subtract, equals

#### Category
- ExpenseCategoryType: Food | Transport | Housing | Entertainment | Other
- IncomeCategoryType: Salary | Bonus | Investment | Gift | Other

#### DateValue
- YYYY-MM-DD形式の日付
- バリデーション: 有効な日付形式

#### Memo
- テキスト型
- 最大文字数: 200文字（Phase 1.5で制限追加）

---

## 5. ユースケース（Application Layer）

### 5.1 収支管理
- [x] AddExpenseService
- [x] AddIncomeService
- [ ] UpdateExpenseService
- [ ] UpdateIncomeService
- [ ] DeleteExpenseService
- [ ] DeleteIncomeService
- [x] CalculateTotalExpenseService
- [x] CalculateTotalIncomeService

### 5.2 検索・フィルタリング
- [ ] GetExpensesByCategoryService
- [ ] GetIncomesByCategoryService
- [ ] GetTransactionsByDateRangeService
- [ ] GetTransactionsByMonthService（既存: findByMonth）

### 5.3 分析・レポート
- [ ] GetMonthlySummaryService
- [ ] GetCategoryExpenseStatisticsService
- [ ] GetSavingsRateService
- [ ] GenerateMonthlyInsightsService
- [ ] GetYearlySummaryService

### 5.4 予算管理
- [ ] CreateBudgetService
- [ ] UpdateBudgetService
- [ ] DeleteBudgetService
- [ ] GetBudgetVsActualService
- [ ] CheckBudgetOverrunService

### 5.5 目標管理
- [ ] CreateSavingsGoalService
- [ ] UpdateSavingsGoalService
- [ ] CalculateGoalAchievementTimelineService
- [ ] SimulateAssetGrowthService

### 5.6 データエクスポート
- [ ] ExportTransactionsToCsvService
- [ ] ExportReportToPdfService
- [ ] ExportTransactionsToExcelService

---

## 6. インフラストラクチャ

### 6.1 Phase 1（現在）
- **データ永続化**: LocalStorage
- **リポジトリ実装**:
  - LocalExpenseRepository
  - LocalIncomeRepository
- **制約**:
  - ブラウザ依存、データは5-10MB制限
  - 複数デバイス間での同期不可

### 6.2 Phase 2（将来）
- **バックエンド**: NestJS + PostgreSQL
- **API**: RESTful API（OpenAPI仕様）
- **認証**: JWT + Refresh Token
- **デプロイ**: Vercel（フロント）+ Railway/Render（バックエンド）

---

## 7. UI/UX要件

### 7.1 ページ構成

| ページ | パス | 優先度 | 実装状況 |
|--------|------|--------|----------|
| ホーム | `/` | 低 | ❌ 空白 |
| ダッシュボード | `/dashboard` | 高 | 🔶 UI完成、データ未連携 |
| トランザクション | `/transactions` | 高 | 🔶 UI完成、データ未連携 |
| チャート | `/charts` | 中 | 🔶 UI完成、データ未連携 |
| レポート | `/reports` | 中 | 🔶 UI完成、データ未連携 |
| シミュレーション | `/simulation` | 中 | 🔶 UI完成、データ未連携 |

### 7.2 ナビゲーション
- **サイドバー**:
  - Dashboard（Homeアイコン）
  - Transactions（Walletアイコン）
  - Chart（PieChartアイコン）
  - Report（BarChart2アイコン）
  - Simulation（TrendingUpアイコン）
- **現在のページをハイライト**
- **フッター**: コピーライト表示

### 7.3 カラースキーム
- **プライマリ**: Sky-500（収入、ポジティブ）
- **セカンダリ**: Red-500（支出、ネガティブ）
- **アクセント**: Green-500（貯蓄、目標達成）
- **ニュートラル**: Gray-100〜900（背景、テキスト）

### 7.4 アニメーション
- モーダル: fadeIn + scaleIn（0.3秒）
- ホバー: scale-105、色変更（0.2秒）
- ページ遷移: フェード（将来実装）

---

## 8. 開発フェーズ計画

### Phase 1: Core MVP（現在〜2週間）
- [x] ドメイン層実装
- [x] インフラ層実装（LocalStorage）
- [x] Zustandストアセットアップ
- [x] 全ページUIデザイン
- [ ] **モーダルとストアの連携**（最優先）
- [ ] **実データ表示**（全ページ）
- [ ] **Edit/Delete機能**
- [ ] **エラーハンドリング**

### Phase 1.5: 機能拡張（2〜4週間）
- [ ] 予算管理機能（Budget エンティティ）
- [ ] 目標管理機能（SavingsGoal エンティティ）
- [ ] 日付範囲フィルター
- [ ] インサイト自動生成ロジック
- [ ] レスポンシブデザイン対応

### Phase 2: バックエンド統合（4〜8週間）
- [ ] NestJS APIサーバー構築
- [ ] PostgreSQL データベース設計
- [ ] 認証・認可実装
- [ ] データエクスポート機能
- [ ] テスト実装（単体・E2E）

### Phase 3: 本番リリース（8週間〜）
- [ ] 多言語対応（i18n）
- [ ] アクセシビリティ改善
- [ ] パフォーマンス最適化
- [ ] デプロイ・CI/CD構築

---

## 9. 成功基準

### 9.1 Phase 1完了基準
- [ ] 収支の追加・編集・削除が正常に動作
- [ ] 全ページで実データが表示される
- [ ] グラフが実データに基づいて更新される
- [ ] エラーが発生してもアプリがクラッシュしない
- [ ] LocalStorageにデータが永続化される

### 9.2 ユーザー満足度（Phase 2以降）
- タスク完了率: 95%以上
- ページ読み込み速度: 平均2秒以内
- ユーザーフィードバック: 4.0/5.0以上

---

## 10. リスク管理

### 10.1 技術的リスク
| リスク | 影響 | 対策 |
|--------|------|------|
| LocalStorageの容量制限 | 高 | Phase 2でDB移行 |
| Zustandの学習曲線 | 低 | 公式ドキュメント参照 |
| DDD実装の複雑性 | 中 | レイヤー分離を厳密に守る |

### 10.2 スケジュールリスク
| リスク | 影響 | 対策 |
|--------|------|------|
| Phase 1の遅延 | 中 | 優先度を明確化、MVP機能に絞る |
| バックエンド実装の遅延 | 低 | LocalStorageで十分動作する設計 |

---

## 11. 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 12. 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|------|-----------|---------|--------|
| 2025-10-23 | 1.0 | 初版作成 | Claude Code |

---

**承認者**: _____________
**承認日**: _____________
