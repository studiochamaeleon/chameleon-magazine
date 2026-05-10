import { PlayIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const embedType = defineType({
  name: 'embed',
  title: 'Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      initialValue: 'iframe',
      options: {
        list: [
          { title: 'Spotify', value: 'spotify' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Generic iframe URL', value: 'iframe' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Spotify, Instagram URL 또는 iframe src URL을 입력하세요.',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'height',
      title: 'Embed Height',
      description: 'Spotify playlist/profile은 352-480, Instagram은 620-760 정도를 권장합니다.',
      type: 'number',
      initialValue: 380,
      validation: (Rule) => Rule.min(180).max(1200),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
      provider: 'provider',
    },
    prepare({ title, subtitle, provider }) {
      return {
        title: title || `${provider || 'Embed'} block`,
        subtitle,
      };
    },
  },
});
