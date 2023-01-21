const express = require('express');
const router = express.Router();
const { createJob, deleteJob, getAllJobs, updateJob, getJob } = require('../controllers/jobs');

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);  //patch request is similar to put request(also used for updating data)
//when using put we try to replace the existing resource while patch is for partial update, i.e in put only prop provided will be updated rest is removed while in patch props remains
//but put method can also be modified to as same functionality as patch

module.exports = router;
