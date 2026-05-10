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
      name: 'isHomepageHero',
      title: 'Homepage Main Story',
      description: '홈 랜딩에서 가장 크게 보여줄 기사입니다. 여러 개가 켜져 있으면 최신 발행일의 기사가 우선 표시됩니다.',
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
      name: 'coverType',
      title: 'Cover Type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'YouTube Embed', value: 'youtube' },
          { title: 'Instagram Embed', value: 'instagram' },
          { title: 'Generic iframe / Spotify Embed', value: 'embed' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => (parent?.coverType ?? 'image') !== 'image',
    }),
    defineField({
      name: 'coverImageCaption',
      title: 'Cover Image Caption',
      description: '커버 이미지 아래에 작게 표시할 설명 문구입니다.',
      type: 'text',
      rows: 2,
      hidden: ({ parent }) => (parent?.coverType ?? 'image') !== 'image',
    }),
    defineField({
      name: 'coverImageCredit',
      title: 'Cover Image Credit',
      description: '사진가, 매체, 에이전시 등 이미지 출처를 입력하세요.',
      type: 'string',
      hidden: ({ parent }) => (parent?.coverType ?? 'image') !== 'image',
    }),
    defineField({
      name: 'coverYouTubeUrl',
      title: 'Cover YouTube URL',
      description: '커버 영역에 삽입할 YouTube 링크입니다.',
      type: 'url',
      hidden: ({ parent }) => parent?.coverType !== 'youtube',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as { coverType?: string })?.coverType === 'youtube' && !value) {
            return 'YouTube 커버를 선택한 경우 URL이 필요합니다.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'coverYouTubeCaption',
      title: 'Cover YouTube Caption',
      description: 'YouTube 커버 아래에 작게 표시할 설명 문구입니다.',
      type: 'text',
      rows: 2,
      hidden: ({ parent }) => parent?.coverType !== 'youtube',
    }),
    defineField({
      name: 'coverEmbedUrl',
      title: 'Cover Embed URL',
      description: 'Instagram URL, Spotify URL 또는 직접 iframe src URL을 입력하세요.',
      type: 'url',
      hidden: ({ parent }) => !['instagram', 'embed'].includes(parent?.coverType ?? ''),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const coverType = (context.parent as { coverType?: string })?.coverType;
          if (['instagram', 'embed'].includes(coverType ?? '') && !value) {
            return '임베드 커버를 선택한 경우 URL이 필요합니다.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'coverEmbedTitle',
      title: 'Cover Embed Title',
      type: 'string',
      hidden: ({ parent }) => !['instagram', 'embed'].includes(parent?.coverType ?? ''),
    }),
    defineField({
      name: 'coverEmbedCaption',
      title: 'Cover Embed Caption',
      description: '임베드 커버 아래에 작게 표시할 설명 문구입니다.',
      type: 'text',
      rows: 2,
      hidden: ({ parent }) => !['instagram', 'embed'].includes(parent?.coverType ?? ''),
    }),
    defineField({
      name: 'coverEmbedHeight',
      title: 'Cover Embed Height',
      description: 'Spotify playlist/profile은 352-480, Instagram은 620-760 정도를 권장합니다.',
      type: 'number',
      initialValue: 680,
      hidden: ({ parent }) => !['instagram', 'embed'].includes(parent?.coverType ?? ''),
      validation: (Rule) => Rule.min(180).max(1200),
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
              name: 'externalImageUrl',
              title: 'Image URL',
              description: '파일 업로드 대신 외부 이미지 주소를 사용할 때 입력하세요.',
              type: 'url',
            }),
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
        defineArrayMember({ type: 'embed' }),
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
