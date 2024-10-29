function getHtml({ category, sku }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Home | AEM Boilerplate</title>
        <link rel="canonical" href="https://main--aem-sfcc--hannessolo.hlx.live/">
        <meta name="description" content="Use this template repository as the starting point for new AEM projects.">
        <meta property="og:title" content="Home | AEM Boilerplate">
        <meta property="og:description" content="Use this template repository as the starting point for new AEM projects.">
        <meta property="og:url" content="https://main--aem-sfcc--hannessolo.hlx.live/">
        <meta property="og:image" content="https://main--aem-sfcc--hannessolo.hlx.live/media_1dc0a2d290d791a050feb1e159746f52db392775a.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        <meta property="og:image:secure_url" content="https://main--aem-sfcc--hannessolo.hlx.live/media_1dc0a2d290d791a050feb1e159746f52db392775a.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        <meta property="og:image:alt" content="Decorative double Helix">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Home | AEM Boilerplate">
        <meta name="twitter:description" content="Use this template repository as the starting point for new AEM projects.">
        <meta name="twitter:image" content="https://main--aem-sfcc--hannessolo.hlx.live/media_1dc0a2d290d791a050feb1e159746f52db392775a.jpeg?width=1200&#x26;format=pjpg&#x26;optimize=medium">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="/scripts/aem.js" type="module"></script>
        <script src="/scripts/scripts.js" type="module"></script>
        <link rel="stylesheet" href="/styles/styles.css">
      </head>
      <body>
        <header></header>
        <main>
          <div>
            <h1>Product ${sku}</h1>
            <p>This product is in category ${category}</p>
          </div>
        </main>
        <footer></footer>
      </body>
    </html>
  `;
}

module.exports = { getHtml };
