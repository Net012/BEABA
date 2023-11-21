export async function uploadArquivo(
  arquivo,
  templateId,
  usuarioId,
  extensaoId,
  squadId,
  diretorio,
  nomeArquivo
) {
  const formData = new FormData();
  formData.append("extensao", arquivo.originalname.split(".").pop());
  formData.append("templateId", templateId);
  formData.append("usuarioId", usuarioId);
  formData.append("extensaoId", extensaoId);
  formData.append("squadId", squadId);
  formData.append("diretorio", diretorio);
  formData.append("nomeArquivo", nomeArquivo);

  const blob = new Blob([arquivo.buffer], { type: arquivo.mimetype });

  formData.append("arquivo", blob, nomeArquivo);

  let retorno;

  try {
    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);

    retorno = {
      message: "Upload realizado com sucesso",
      status: 200,
    };
    return retorno;
  } catch (error) {
    console.log(error);
    retorno = {
      message: "Error ao realizar o upload",
      status: 500,
    };
    return retorno;
  }
}
