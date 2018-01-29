const router = require('express').Router();
const axios = require('axios');

const baseURL = 'http://cnodejs.org/api/v1';

router.post('/login', (req, res, next) => {
  axios
    .post(`${baseURL}/accesstoken`, {
      accesstoken: req.body.accessToken
    })
    .then(response => {
      const data = response.data;
      if (response.status === 200 && data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: data.loginname,
          id: data.id,
          avatarUrl: data.avatar_url
        };

        res.json({
          success: true,
          data: data
        });
      } else {
        res.status(response.status).send(response.data);
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data);
      } else {
        next(err);
      }
    });
});

module.exports = router;
