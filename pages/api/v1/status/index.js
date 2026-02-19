function status(request, response) {
  response.status(200).json({ informacao: "valor_informacao" });
}

export default status;
