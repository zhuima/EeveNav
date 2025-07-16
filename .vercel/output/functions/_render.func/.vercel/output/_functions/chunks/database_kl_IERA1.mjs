import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { r as removeBase, i as isRemotePath, V as VALID_INPUT_FORMATS, A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from './astro/assets-service_DRcq-ftW.mjs';
import { c as createComponent, i as renderUniqueStylesheet, j as renderScriptElement, k as createHeadAndContent, f as renderComponent, e as renderTemplate, u as unescapeHTML } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import * as devalue from 'devalue';
import { createClient } from '@libsql/client';
import * as z from 'zod';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/Input-Source-Pro.md": () => import('./Input-Source-Pro_B0FQ6eFv.mjs'),"/src/content/blog/free-avatars.md": () => import('./free-avatars_BCqFuX1n.mjs'),"/src/content/blog/rxresu.md": () => import('./rxresu_BlC9RTGI.mjs'),"/src/content/blog/yesicon.md": () => import('./yesicon_C0CEFIUm.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"blog":{"type":"content","entries":{"input-source-pro":"/src/content/blog/Input-Source-Pro.md","free-avatars":"/src/content/blog/free-avatars.md","rxresu":"/src/content/blog/rxresu.md","yesicon":"/src/content/blog/yesicon.md"}}};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/Input-Source-Pro.md": () => import('./Input-Source-Pro_C3cgSYsK.mjs'),"/src/content/blog/free-avatars.md": () => import('./free-avatars_DuuwZ9bx.mjs'),"/src/content/blog/rxresu.md": () => import('./rxresu_B513h5LJ.mjs'),"/src/content/blog/yesicon.md": () => import('./yesicon_zHzQ_bjW.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

const PostSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, "标题不能为空").max(200, "标题过长"),
  date: z.date(),
  des: z.string().max(500, "描述过长").default(""),
  // 允许为空
  cover: z.string().url("封面必须是有效的URL").or(z.literal("")).default(""),
  // 允许为空字符串
  category: z.string().min(1, "分类不能为空").max(100, "分类名称过长").default("unsorted"),
  tags: z.array(z.string().min(1, "标签不能为空").max(50, "标签名称过长")).default([]),
  content: z.string().min(1, "内容不能为空"),
  slug: z.string().min(1, "slug不能为空").max(200, "slug过长"),
  external_url: z.string().url("外部链接必须是有效的URL").optional().or(z.literal("")).nullable(),
  // 完全可选，允许空字符串和null
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
class BlogDatabase {
  db;
  initialized;
  constructor(url, authToken) {
    const dbUrl = url || process.env.TURSO_DATABASE_URL || "libsql://jinju-zhuima.aws-ap-northeast-1.turso.io";
    const dbToken = authToken || process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTIyOTM0MjQsImlkIjoiOWZiNDEwMDktMjA4Mi00YTc1LWJkYzMtYWRlYWNkOTU5Nzk5IiwicmlkIjoiNGY3OTE3M2UtMWRjNC00NDBiLTkyMDgtZTA0OTVjNTE3NjZhIn0.oM4IIZbb6ut1ss_mfY0AtjR4q_8-3zsnxv6MwbqeonAp2qvA8eatYWMgxVLBafyNkCwr5ND4J110pV6qe_ybDg";
    this.db = createClient({
      url: dbUrl,
      authToken: dbToken
    });
    this.initialized = this.initTables();
  }
  async initTables() {
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        des TEXT NOT NULL,
        cover TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'unsorted',
        content TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        external_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createTagsTable = `
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createPostTagsTable = `
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `;
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createIndexes = [
      "CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)",
      "CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date)",
      "CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)",
      "CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id)",
      "CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id)"
    ];
    await this.db.execute(createPostsTable);
    await this.db.execute(createTagsTable);
    await this.db.execute(createPostTagsTable);
    await this.db.execute(createCategoriesTable);
    for (const index of createIndexes) {
      await this.db.execute(index);
    }
  }
  // 添加文章
  async addPost(postData) {
    await this.initialized;
    const validatedData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).parse(postData);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.db.execute({
      sql: "INSERT OR IGNORE INTO categories (name) VALUES (?)",
      args: [validatedData.category]
    });
    const result = await this.db.execute({
      sql: "INSERT INTO posts (title, date, des, cover, category, content, slug, external_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        validatedData.title,
        validatedData.date.toISOString(),
        validatedData.des,
        validatedData.cover,
        validatedData.category,
        validatedData.content,
        validatedData.slug,
        validatedData.external_url || null,
        now,
        now
      ]
    });
    const postId = Number(result.lastInsertRowid);
    if (validatedData.tags && validatedData.tags.length > 0) {
      await this.addTagsToPost(postId, validatedData.tags);
    }
    return postId;
  }
  // 为文章添加标签
  async addTagsToPost(postId, tags) {
    for (const tagName of tags) {
      await this.db.execute({
        sql: "INSERT OR IGNORE INTO tags (name) VALUES (?)",
        args: [tagName]
      });
      const tagResult = await this.db.execute({
        sql: "SELECT id FROM tags WHERE name = ?",
        args: [tagName]
      });
      const tag = tagResult.rows[0];
      await this.db.execute({
        sql: "INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
        args: [postId, tag.id]
      });
    }
  }
  // 获取所有文章
  async getPosts() {
    await this.initialized;
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.date DESC
    `;
    const result = await this.db.execute(query);
    const rows = result.rows;
    return rows.map((row) => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    }));
  }
  // 根据slug获取文章
  async getPostBySlug(slug) {
    await this.initialized;
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = ?
      GROUP BY p.id
    `;
    const result = await this.db.execute({
      sql: query,
      args: [slug]
    });
    const row = result.rows[0];
    if (!row)
      return null;
    return {
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    };
  }
  // 根据ID获取文章
  async getPostById(id) {
    await this.initialized;
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    const result = await this.db.execute({
      sql: query,
      args: [id]
    });
    const row = result.rows[0];
    if (!row)
      return null;
    return {
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    };
  }
  // 获取分类和文章数量
  async getCategories() {
    await this.initialized;
    const query = `
      SELECT 
        c.name,
        COUNT(p.id) as count
      FROM categories c
      LEFT JOIN posts p ON c.name = p.category
      GROUP BY c.name
      ORDER BY count DESC, c.name
    `;
    const result = await this.db.execute(query);
    return result.rows;
  }
  // 获取所有标签
  async getTags() {
    await this.initialized;
    const query = `
      SELECT DISTINCT t.name
      FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      ORDER BY t.name
    `;
    const result = await this.db.execute(query);
    const rows = result.rows;
    return rows.map((row) => row.name);
  }
  // 根据分类获取文章
  async getPostsByCategory(category) {
    await this.initialized;
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.category = ?
      GROUP BY p.id
      ORDER BY p.date DESC
    `;
    const result = await this.db.execute({
      sql: query,
      args: [category]
    });
    const rows = result.rows;
    return rows.map((row) => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    }));
  }
  // 根据标签获取文章
  async getPostsByTag(tag) {
    await this.initialized;
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t2.name) as tags
      FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_tags pt2 ON p.id = pt2.post_id
      LEFT JOIN tags t2 ON pt2.tag_id = t2.id
      WHERE t.name = ?
      GROUP BY p.id
      ORDER BY p.date DESC
    `;
    const result = await this.db.execute({
      sql: query,
      args: [tag]
    });
    const rows = result.rows;
    return rows.map((row) => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    }));
  }
  // 更新文章
  async updatePost(id, postData) {
    await this.initialized;
    const validatedData = PostSchema.partial().omit({ id: true, created_at: true, updated_at: true }).parse(postData);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updateFields = [];
    const updateValues = [];
    if (validatedData.title !== void 0) {
      updateFields.push("title = ?");
      updateValues.push(validatedData.title);
    }
    if (validatedData.date !== void 0) {
      updateFields.push("date = ?");
      updateValues.push(validatedData.date.toISOString());
    }
    if (validatedData.des !== void 0) {
      updateFields.push("des = ?");
      updateValues.push(validatedData.des);
    }
    if (validatedData.cover !== void 0) {
      updateFields.push("cover = ?");
      updateValues.push(validatedData.cover);
    }
    if (validatedData.category !== void 0) {
      updateFields.push("category = ?");
      updateValues.push(validatedData.category);
      await this.db.execute({
        sql: "INSERT OR IGNORE INTO categories (name) VALUES (?)",
        args: [validatedData.category]
      });
    }
    if (validatedData.content !== void 0) {
      updateFields.push("content = ?");
      updateValues.push(validatedData.content);
    }
    if (validatedData.slug !== void 0) {
      updateFields.push("slug = ?");
      updateValues.push(validatedData.slug);
    }
    if (validatedData.external_url !== void 0) {
      updateFields.push("external_url = ?");
      updateValues.push(validatedData.external_url);
    }
    updateFields.push("updated_at = ?");
    updateValues.push(now);
    updateValues.push(id);
    if (updateFields.length === 0)
      return;
    const query = `UPDATE posts SET ${updateFields.join(", ")} WHERE id = ?`;
    await this.db.execute({
      sql: query,
      args: updateValues
    });
    if (postData.tags !== void 0) {
      await this.db.execute({
        sql: "DELETE FROM post_tags WHERE post_id = ?",
        args: [id]
      });
      if (postData.tags.length > 0) {
        await this.addTagsToPost(id, postData.tags);
      }
    }
  }
  // 删除文章
  async deletePost(id) {
    await this.initialized;
    await this.db.execute({
      sql: "DELETE FROM posts WHERE id = ?",
      args: [id]
    });
  }
  // 删除分类
  async deleteCategory(categoryName) {
    await this.initialized;
    const result = await this.db.execute({
      sql: "SELECT COUNT(*) as count FROM posts WHERE category = ?",
      args: [categoryName]
    });
    const postsWithCategory = result.rows[0];
    if (postsWithCategory.count > 0) {
      throw new Error(`无法删除分类 "${categoryName}"，因为还有 ${postsWithCategory.count} 篇文章使用该分类`);
    }
    const deleteResult = await this.db.execute({
      sql: "DELETE FROM categories WHERE name = ?",
      args: [categoryName]
    });
    if (deleteResult.rowsAffected === 0) {
      throw new Error(`分类 "${categoryName}" 不存在`);
    }
    return deleteResult.rowsAffected;
  }
  // 复制文章
  async copyPost(originalId, newSlug) {
    await this.initialized;
    const result = await this.db.execute({
      sql: "SELECT * FROM posts WHERE id = ?",
      args: [originalId]
    });
    const originalPost = result.rows[0];
    if (!originalPost) {
      throw new Error("原始文章不存在");
    }
    const tagsResult = await this.db.execute({
      sql: "SELECT t.name FROM tags t INNER JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?",
      args: [originalId]
    });
    const originalTags = tagsResult.rows;
    (/* @__PURE__ */ new Date()).toISOString();
    const baseSlug = newSlug || `${originalPost.slug}-copy`;
    let finalSlug = baseSlug;
    let counter = 1;
    while (await this.getPostBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    const copyData = {
      title: `${originalPost.title} (副本)`,
      date: new Date(originalPost.date),
      des: originalPost.des,
      cover: originalPost.cover,
      category: originalPost.category,
      content: originalPost.content,
      slug: finalSlug,
      external_url: originalPost.external_url,
      tags: originalTags.map((tag) => tag.name)
    };
    const newPostId = await this.addPost(copyData);
    return newPostId;
  }
  // 搜索文章（搜索标题、描述和内容）
  async searchPosts(query) {
    await this.initialized;
    if (!query.trim()) {
      return [];
    }
    const searchTerm = `%${query.trim()}%`;
    const searchQuery = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE (
        p.title LIKE ? COLLATE NOCASE
        OR p.des LIKE ? COLLATE NOCASE
        OR p.content LIKE ? COLLATE NOCASE
        OR p.category LIKE ? COLLATE NOCASE
        OR EXISTS (
          SELECT 1 FROM post_tags pt2 
          INNER JOIN tags t2 ON pt2.tag_id = t2.id 
          WHERE pt2.post_id = p.id AND t2.name LIKE ? COLLATE NOCASE
        )
      )
      GROUP BY p.id
      ORDER BY 
        CASE 
          WHEN p.title LIKE ? COLLATE NOCASE THEN 1
          WHEN p.des LIKE ? COLLATE NOCASE THEN 2
          WHEN p.category LIKE ? COLLATE NOCASE THEN 3
          ELSE 4
        END,
        p.date DESC
    `;
    const result = await this.db.execute({
      sql: searchQuery,
      args: [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        // WHERE 条件
        searchTerm,
        searchTerm,
        searchTerm
        // ORDER BY 条件
      ]
    });
    const rows = result.rows;
    return rows.map((row) => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    }));
  }
  // 获取相关文章（基于分类和标签）
  async getRelatedPosts(postId, limit = 4) {
    await this.initialized;
    const currentPostResult = await this.db.execute({
      sql: `
        SELECT p.category, GROUP_CONCAT(t.name) as tags
        FROM posts p
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.id = ?
        GROUP BY p.id
      `,
      args: [postId]
    });
    if (!currentPostResult.rows[0]) {
      return [];
    }
    const currentPost = currentPostResult.rows[0];
    const currentTags = currentPost.tags ? currentPost.tags.split(",") : [];
    if (currentTags.length === 0) {
      const result2 = await this.db.execute({
        sql: `
          SELECT 
            p.*,
            GROUP_CONCAT(t.name) as tags
          FROM posts p
          LEFT JOIN post_tags pt ON p.id = pt.post_id
          LEFT JOIN tags t ON pt.tag_id = t.id
          WHERE p.id != ? AND p.category = ?
          GROUP BY p.id
          ORDER BY p.date DESC
          LIMIT ?
        `,
        args: [postId, currentPost.category, limit]
      });
      const rows2 = result2.rows;
      return rows2.map((row) => ({
        ...row,
        date: new Date(row.date),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        tags: row.tags ? row.tags.split(",") : []
      }));
    }
    const placeholders = currentTags.map(() => "?").join(",");
    const relatedQuery = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags,
        CASE 
          WHEN p.category = ? THEN 2
          ELSE 0
        END +
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM post_tags pt2 
            INNER JOIN tags t2 ON pt2.tag_id = t2.id 
            WHERE pt2.post_id = p.id AND t2.name IN (${placeholders})
          ) THEN 1
          ELSE 0
        END as relevance_score
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id != ? 
        AND (
          p.category = ? 
          OR EXISTS (
            SELECT 1 FROM post_tags pt3 
            INNER JOIN tags t3 ON pt3.tag_id = t3.id 
            WHERE pt3.post_id = p.id AND t3.name IN (${placeholders})
          )
        )
      GROUP BY p.id
      HAVING relevance_score > 0
      ORDER BY relevance_score DESC, p.date DESC
      LIMIT ?
    `;
    const args = [
      currentPost.category,
      // 第一个分类条件
      ...currentTags,
      // 标签条件1
      postId,
      // 排除当前文章
      currentPost.category,
      // 第二个分类条件
      ...currentTags,
      // 标签条件2
      limit
      // 限制数量
    ];
    const result = await this.db.execute({
      sql: relatedQuery,
      args
    });
    const rows = result.rows;
    return rows.map((row) => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(",") : []
    }));
  }
  // 关闭数据库连接
  close() {
  }
}
let dbInstance = null;
function getDatabase() {
  if (!dbInstance) {
    dbInstance = new BlogDatabase(
      process.env.TURSO_DATABASE_URL,
      process.env.TURSO_AUTH_TOKEN
    );
  }
  return dbInstance;
}

export { PostSchema as P, getCollection as a, getDatabase as g };
