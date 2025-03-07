import { bot } from '#/bot'

const VIDEO_FILE_ID = 'BAACAgIAAxkDAAJPrmfJ-acWfo3-MDnwESen4FHRxU1HAAKVdAAC43tQStM605kiJm5bNgQ'

bot.command('pannya', async ctx => {
  await ctx.replyWithVideo(VIDEO_FILE_ID)
})
