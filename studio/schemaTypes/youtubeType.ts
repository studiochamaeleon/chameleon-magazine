import { PlayIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const youtubeType = defineType({
  name: 'youtube',
  title: 'YouTube',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'url',
      subtitle: 'caption',
    },
  },
});
