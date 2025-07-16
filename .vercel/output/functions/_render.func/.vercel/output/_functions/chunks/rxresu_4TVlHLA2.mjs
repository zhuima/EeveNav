import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, e as renderTemplate } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>网址: <a href=\"https://rxresu.me/\">https://rxresu.me/</a></p>\n<p>之前在找工作的时候，需要准备简历，但是简历的格式和内容比较繁琐，所以就找了一些简历生成器，这个是我在GitHub上找到的，感觉还不错，就推荐给大家。同类作品还有 <a href=\"https://easycv.cn/\">简单简历</a></p>";

				const frontmatter = {"title":"免费开源的简历生成器","des":"一款免费开源的简历生成器，可简化创建、更新和共享简历的过程","date":"2024-10-03T00:00:00.000Z","cover":"https://pub-7cd46562d86a460881359b6ed3de331e.r2.dev/blog/2024/10/5dbbfe803e75d702e490f1affde45017.png","tags":["工具资源"],"category":"工具资源"};
				const file = "/home/zhuima/github/javascript/EeveNav/src/content/blog/rxresu.md";
				const url = undefined;
				function rawContent() {
					return "\n网址: [https://rxresu.me/](https://rxresu.me/)\n\n之前在找工作的时候，需要准备简历，但是简历的格式和内容比较繁琐，所以就找了一些简历生成器，这个是我在GitHub上找到的，感觉还不错，就推荐给大家。同类作品还有 [简单简历](https://easycv.cn/)\n";
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
