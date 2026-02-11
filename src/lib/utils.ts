export function getDirectDriveLink(url: string | null | undefined) {
    if (!url) return '';

    // Se o link já for direto ou não for do Google Drive, retorna ele mesmo
    if (!url.includes('drive.google.com')) return url;

    // Regex aprimorada para pegar o ID entre /d/ e qualquer caractere seguinte (barra, interrogação ou fim da linha)
    const match = url.match(/\/d\/([^/\\?]+)/) || url.match(/id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) return url;

    // Link de visualização direta oficial
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}