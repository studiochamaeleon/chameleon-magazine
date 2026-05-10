import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

const categories = [
  { title: 'News', value: 'news' },
  { title: 'Listen', value: 'listen' },
  { title: 'Visual', value: 'visual' },
  { title: 'Culture', value: 'culture' },
];

const subcategories = [
  { title: 'Music News', value: 'music-news' },
  { title: 'Weekly News', value: 'weekly-news' },
  { title: 'Reviews', value: 'reviews' },
  { title: 'Playlists', value: 'playlists' },
  { title: 'Music Videos', value: 'music-videos' },
  { title: 'Live', value: 'live' },
  { title: 'Fashion', value: 'fashion' },
  { title: 'Product', value: 'product' },
  { title: 'Trend Report', value: 'trend-report' },
  { title: 'Artist Focus', value: 'artist-focus' },
];

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: categories, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      options: { list: subcategories },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'isEditorsPick',
      title: "Editor's Pick",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'CHAMELEON Editorial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImageCaption',
      title: 'Cover Image Caption',
      description: '커버 이미지 아래에 작게 표시할 설명 문구입니다.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'coverImageCredit',
      title: 'Cover Image Credit',
      description: '사진가, 매체, 에이전시 등 이미지 출처를 입력하세요.',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({ type: 'youtube' }),
      ],
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'article' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subcategory',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
