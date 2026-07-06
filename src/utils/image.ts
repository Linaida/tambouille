type ResizeImageOptions = {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Impossible de lire le fichier image.'))
    }

    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'))
    reader.readAsDataURL(file)
  })
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Impossible de charger l’image.'))

    image.src = src
  })
}

export const resizeImageFile = async (
  file: File,
  options: ResizeImageOptions = {},
): Promise<string> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
  } = options

  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)

  const ratio = Math.min(
    maxWidth / image.width,
    maxHeight / image.height,
    1,
  )

  const width = Math.round(image.width * ratio)
  const height = Math.round(image.height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Impossible de préparer l’image.')
  }

  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', quality)
}