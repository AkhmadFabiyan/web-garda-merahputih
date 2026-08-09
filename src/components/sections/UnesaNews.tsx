import React from 'react';
import * as cheerio from 'cheerio';
import Image from 'next/image';
import { Container } from '../ui/Container';
import styles from './UnesaNews.module.css';

// Tipe data untuk berita
type NewsItem = {
  title: string;
  link: string;
  image: string;
  desc: string;
};

// Mengambil data berita langsung dari website unesa (server-side)
async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://www.unesa.ac.id/category/berita-unesa', {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000) // Timeout 8 detik agar tidak membuat website loading lama
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const newsItems: NewsItem[] = [];
    
    $('.blog-carousel > .row').each((index, element) => {
      const title = $(element).find('.blog-carousel-header h3 a').text().trim();
      
      // Lewati elemen yang tidak punya judul (biasanya pagination)
      if (!title) return;
      
      let link = $(element).find('.blog-carousel-header h3 a').attr('href') || '';
      if (link.startsWith('//')) link = 'https:' + link;
      else if (link.startsWith('/')) link = 'https://www.unesa.ac.id' + link;
      
      let image = $(element).find('img').attr('src') || $(element).find('img').attr('data-src') || '';
      if (image.startsWith('//')) image = 'https:' + image;
      else if (image.startsWith('/')) image = 'https://www.unesa.ac.id' + image;
      else if (!image.startsWith('http') && image) image = 'https://www.unesa.ac.id/' + image;
      
      const desc = $(element).find('.blog-carousel-desc').text().trim();
      
      newsItems.push({ title, link, image, desc });
    });
    
    return newsItems;
  } catch (error) {
    console.error("Gagal melakukan scraping berita:", error);
    return [];
  }
}

export const UnesaNews = async () => {
  const news = await getLatestNews();

  // Jika gagal scrape atau kosong, tidak usah tampilkan seksi ini
  if (!news || news.length === 0) return null;

  return (
    <section className={styles.section} id="berita-unesa">
      <Container>
        <div className={styles.masterBox}>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionTitle}>Berita Terbaru Unesa</h2>
          </div>

          <div className={styles.grid}>
            {news.slice(0, 6).map((item, index) => (
              <a 
                key={index} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.card}
              >
                {item.image && (
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      style={{ objectFit: 'cover' }}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                )}
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.desc}</p>
                  <div className={styles.readMore}>
                    Selengkapnya <span>➔</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
