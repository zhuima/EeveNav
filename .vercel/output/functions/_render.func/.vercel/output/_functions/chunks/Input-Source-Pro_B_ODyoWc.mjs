import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, e as renderTemplate } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>网址: <a href=\"https://inputsource.pro/\">https://inputsource.pro/</a></p>\n<p>我使用的是Mac的默认拼音输入法，但是在切换写代码的时候，或者使用Raycast的时候，需要指定输入法为英文，这时候就可以使用Input Source Pro来控制。</p>";

				const frontmatter = {"title":"Input Source Pro-输入法切换","des":"控制App使用什么输入法","date":"2024-10-02T00:00:00.000Z","cover":"https://pub-7cd46562d86a460881359b6ed3de331e.r2.dev/blog/2024/10/969b8feeee96346783d69f6916f482d6.png","tags":["工具资源"],"category":"工具资源"};
				const file = "/home/zhuima/github/javascript/EeveNav/src/content/blog/Input-Source-Pro.md";
				const url = undefined;
				function rawContent() {
					return "\n网址: [https://inputsource.pro/](https://inputsource.pro/)\n\n我使用的是Mac的默认拼音输入法，但是在切换写代码的时候，或者使用Raycast的时候，需要指定输入法为英文，这时候就可以使用Input Source Pro来控制。\n";
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
