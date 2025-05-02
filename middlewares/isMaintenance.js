function isMaintenance(req, res, next) {
  const isMaintenance = process.env.isMaintenance === "true";
  if (isMaintenance) {
    return res.status(503).send("server is under maintenance");
  }
  next();
}

export default isMaintenance;
