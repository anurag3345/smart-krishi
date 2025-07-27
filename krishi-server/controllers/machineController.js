const Machine = require('../models/Machine');

exports.createMachine = async (req, res) => {
  try {
    const { toolName, category, rentalPrice, availabilityStatus, description, ownerid, imageBase64 } = req.body;
    
    // Validate required fields
    if (!toolName || !category || !rentalPrice || !availabilityStatus || !description || !ownerid || !imageBase64) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields including image are required' 
      });
    }

    // Validate base64 image
    if (!imageBase64.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Please use base64 encoded image.'
      });
    }

    // Extract MIME type and base64 data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image data'
      });
    }

    const imageData = {
      data: Buffer.from(matches[2], 'base64'),
      contentType: matches[1]
    };

    // Check image size (max 5MB)
    if (imageData.data.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image too large. Maximum size is 5MB.'
      });
    }

    // Create new machine
    const machine = new Machine({
      toolName,
      category,
      rentalPrice,
      availabilityStatus,
      description,
      image: imageData,
      ownerId: ownerid
    });

    await machine.save();

    // Return success response without sending back the image data
    const responseMachine = machine.toObject();
    delete responseMachine.image;

    res.status(201).json({
      success: true,
      data: responseMachine
    });

  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

exports.getAllMachines = async (req, res) => {
  try {
    // Get machines without image data for listing
    const machines = await Machine.find()
      .select('-image.data') // Exclude the binary image data
      .populate('ownerId', 'name email');
    
    res.status(200).json({
      success: true,
      count: machines.length,
      data: machines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getMachineImage = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).select('image contentType');
    
    if (!machine || !machine.image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Set proper content type and send image
    res.set('Content-Type', machine.image.contentType);
    res.send(machine.image.data);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};