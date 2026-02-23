import fs from 'fs';
import path from 'path';

export default function Home({ htmlContent }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export async function getStaticProps() {
  // Read the HTML file from public folder
  const htmlPath = path.join(process.cwd(), 'public', 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  return {
    props: {
      htmlContent,
    },
  };
}