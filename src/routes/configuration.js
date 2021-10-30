const { Router } = require('express'); 
const {body} = require('express-validator'); 
const { ConfigurationController } = require('../controllers/ConfigurationController');  


const router = Router();

const configurationController = new ConfigurationController(); 

router.post('/reset', configurationController.reset); 

router.post(
  '/config', 
  body('url')
  .exists()
  .isURL(), 
  configurationController.config
);

module.exports = router;