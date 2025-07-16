import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, e as renderTemplate } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>网址: <a href=\"https://yesicon.app/\">https://yesicon.app/</a></p>\n<p>目前我的主力开发搜索图标网站，适配unocss，基本上可以满足日常开发需求。</p>";

				const frontmatter = {"title":"免费的矢量图标网站-yesicon","des":"一个免费的矢量图标网站,量多又好用","date":"2024-10-03T00:00:00.000Z","cover":"https://pub-7cd46562d86a460881359b6ed3de331e.r2.dev/blog/2024/10/269662ce60966725cfee84ed90c64c2e.png","tags":["工具资源"],"category":"工具资源"};
				const file = "/home/zhuima/github/javascript/EeveNav/src/content/blog/yesicon.md";
				const url = undefined;
				function rawContent() {
					return "\n网址: [https://yesicon.app/](https://yesicon.app/)\n\n目前我的主力开发搜索图标网站，适配unocss，基本上可以满足日常开发需求。\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
