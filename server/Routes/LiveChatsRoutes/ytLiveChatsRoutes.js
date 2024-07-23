const express = require('express');
const { getLiveChatId } = require('../../Controler/google/getLiveChatId');
const { getLiveChats } = require('../../Controler/google/getLiveChats');
const router = express.Router();

router.get('/google/livechatid', getLiveChatId);
router.get('/google/getlivechats', getLiveChats);

module.exports = router;