const updateImageStatus = {
    params: Joi.object().keys({
      imageId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
      .keys({
        status: Joi.string().required(),
      })
      .min(1),
  };