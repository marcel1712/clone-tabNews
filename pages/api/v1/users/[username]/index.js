import controller from "infra/controller.js";
import { createRouter } from "next-connect";
import user from "models/user.js";
import authorization from "models/authorization.js";
import { ForbiddenError } from "infra/errors.js";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(getHandler);
router.patch(controller.canRequest("update:user", ), patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  return response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  //user, feature, resource
  const userTryingToPatch = request.context.user;
  const targetUser = await user.findOneByUsername(username);

  if(!authorization.can(userTryingToPatch, "update:user", targetUser)){
    throw new ForbiddenError({
      message: "Voce nao possui permissao para atualizar outro usuario",
      action: "Verifique se voce possui a feature necessaria para atualizar outro usuario"
    })
  }

  const updatedUser = await user.update(username, userInputValues);
  return response.status(200).json(updatedUser);
}
