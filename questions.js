const QUESTIONS = [
 {id:1,cat:'strategy',q:'企業がDXを進める主な目的として最も適切なものはどれか。',choices:['紙の書類を必ず残す','デジタル技術で業務やビジネスモデルを変革する','全社員のPCを同じメーカーにする','インターネット利用を禁止する'],answer:1,ex:'DXは、デジタル技術を使って業務・組織・ビジネスモデルを変えることです。'},
 {id:2,cat:'technology',q:'情報セキュリティの三要素 CIA に含まれないものはどれか。',choices:['機密性','完全性','可用性','収益性'],answer:3,ex:'CIAは Confidentiality, Integrity, Availability。収益性は含まれません。'},
 {id:3,cat:'management',q:'プロジェクトで、作業を細かく分解して階層化したものはどれか。',choices:['WBS','VPN','SQL','SLA'],answer:0,ex:'WBSは Work Breakdown Structure。作業を分解して管理します。'},
 {id:4,cat:'technology',q:'データベースから条件に合うデータを取り出す言語はどれか。',choices:['HTML','SQL','CSS','DNS'],answer:1,ex:'SQLはデータベースを操作するための言語です。'},
 {id:5,cat:'strategy',q:'SWOT分析で、企業内部のプラス要因を表すものはどれか。',choices:['機会','脅威','強み','弱み'],answer:2,ex:'内部のプラス要因は Strength=強みです。'},
 {id:6,cat:'technology',q:'二要素認証の例として適切なものはどれか。',choices:['IDとパスワードだけ','パスワードとスマホ認証コード','同じパスワードを2回入力','秘密の質問を3つ設定'],answer:1,ex:'知識情報＋所持情報のように、異なる要素を組み合わせます。'},
 {id:7,cat:'management',q:'サービス提供者と利用者の間で、サービス品質を合意する文書はどれか。',choices:['SLA','CPU','CRM','BPMN'],answer:0,ex:'SLAは Service Level Agreement。サービス水準の合意です。'},
 {id:8,cat:'technology',q:'LAN内で機器を識別するため、NICに割り当てられる固有番号はどれか。',choices:['MACアドレス','URL','Cookie','QRコード'],answer:0,ex:'MACアドレスはネットワーク機器に割り当てられる識別番号です。'},
 {id:9,cat:'strategy',q:'顧客との関係を管理し、満足度向上や売上向上を目指す仕組みはどれか。',choices:['CRM','VPN','OS','RAID'],answer:0,ex:'CRMは Customer Relationship Management。顧客関係管理です。'},
 {id:10,cat:'technology',q:'マルウェア感染対策として最も適切なものはどれか。',choices:['OS更新を止める','不審な添付ファイルを開かない','全員で同じパスワードを使う','バックアップを削除する'],answer:1,ex:'不審ファイルを開かない、更新、バックアップが基本です。'},
 {id:11,cat:'management',q:'システム開発で、利用者の要望を整理して必要な機能を明確にする工程はどれか。',choices:['要件定義','廃棄','暗号化','圧縮'],answer:0,ex:'要件定義は、何を作るかを明確にする工程です。'},
 {id:12,cat:'technology',q:'Webページの構造を記述する言語はどれか。',choices:['HTML','SQL','TCP','AES'],answer:0,ex:'HTMLはWebページの見出し・段落・リンクなどの構造を表します。'}
];
