const express = require('express')
const router = express.Router()
const adminController = require('../../controller/admin-controller')
const upload =require('../../middleware/multer')

router.get('/collections/create',adminController.createCollection)
router.get('/collections/:id/edit',adminController.editCollection)
router.get('/collections/:id',adminController.getCollection)
router.delete('/collections/:id',adminController.deleteCollection)
router.put('/collections/:id',upload.single('image'),adminController.putCollection)
router.post('/collections',upload.single('image'), adminController.postCollection)
router.get('/collections',adminController.getCollections)

router.get('/exhibitions/create', adminController.createExhibition)
router.get('/exhibitions/:id/edit', adminController.editExhibition)
router.get('/exhibitions/:id', adminController.getExhibition)
router.delete('/exhibitions/:id', adminController.deleteExhibition)
router.put('/exhibitions/:id',upload.single('image'), adminController.putExhibition)
router.post('/exhibitions',upload.single('image'), adminController.postExhibition)
router.get('/exhibitions', adminController.getExhibitions)

router.get('/users',adminController.getUsers)
router.patch('/users/:id',adminController.patchUser)

router.get('/videos',adminController.getVideos)
module.exports = router