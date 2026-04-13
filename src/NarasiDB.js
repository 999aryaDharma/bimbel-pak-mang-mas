// ============================================================
// NARASI_DB.GS - Database Narasi Terpusat (Semua Modul Tes)
// ============================================================
// File ini HANYA berisi konstanta data.
// Fungsi bisnis ada di file modul masing-masing.
// ============================================================


// ------------------------------------------------------------
// WARTEGG: Narasi Global per Kategori
// ------------------------------------------------------------
const NARASI_WARTEGG_GLOBAL = {
  "Rendah": {
    aspek: "Kualitas garis tampak lemah, ragu-ragu, dan kurang bertenaga. Pemanfaatan ruang gambar cenderung sempit atau tidak proporsional, menunjukkan adanya hambatan dalam koordinasi visual-motorik serta ketelitian yang rendah dalam menangani stimulus yang diberikan.",
    interpretasi: "Secara psikologis, subjek menunjukkan indikasi krisis identitas dan kepercayaan diri yang sangat rendah. Terdapat hambatan emosional yang signifikan serta tingkat kecemasan yang tinggi, sehingga subjek cenderung menarik diri (withdraw) dan merasa tidak aman di lingkungan baru.",
    deskripsi: "Individu memiliki daya juang yang sangat rendah dan mudah menyerah pada hambatan kecil. Pola pikir cenderung tidak terorganisir dan sangat subjektif. Dalam bekerja, subjek mudah merasa tertekan oleh tanggung jawab, kurang memiliki arah tujuan hidup, serta sangat mudah dipengaruhi oleh orang lain karena tidak memiliki prinsip diri yang kuat.",
    rekomendasi: "Tidak direkomendasikan untuk posisi mandiri. Subjek memerlukan bimbingan intensif serta penempatan pada bidang kerja dengan risiko stres minimal dan lingkungan yang sangat stabil."
  },
  "Cukup": {
    aspek: "Garis cukup variatif namun menunjukkan tekanan yang tidak konsisten. Penempatan objek cukup teratur, namun kurang dalam eksplorasi detail atau kreativitas visual, menunjukkan kemampuan teknis yang berada pada level rata-rata.",
    interpretasi: "Keseimbangan emosi cenderung fluktuatif namun masih dalam batas kendali wajar. Subjek mulai menunjukkan kesadaran diri, meskipun dalam pengambilan keputusan masih sering didominasi rasa ragu dan sangat bergantung pada penilaian atau dukungan dari figur otoritas.",
    deskripsi: "Mampu bersosialisasi dengan baik pada lingkungan yang sudah dikenal, namun cenderung pasif jika harus memulai interaksi di tempat baru. Memiliki ambisi untuk maju namun sering kehilangan fokus oleh kendala teknis. Individu membutuhkan supervisi berkala agar tetap konsisten dalam kedisiplinan dan pencapaian target kerja.",
    rekomendasi: "Dapat direkomendasikan untuk posisi staf pelaksana atau administrasi rutin dengan catatan perlu diberikan pelatihan berkelanjutan untuk meningkatkan inisiatif serta kepercayaan diri dalam bekerja."
  },
  "Baik": {
    aspek: "Garis stabil, tegas, dan bentuk gambar terencana secara logis. Penggunaan ruang dan detail yang memadai menunjukkan koordinasi visual-motorik yang sehat serta kemampuan organisasi yang baik dalam menangani tugas-tugas teknis.",
    interpretasi: "Memiliki stabilitas emosi yang baik dan tingkat kemandirian yang stabil. Subjek mampu menjalin hubungan interpersonal secara profesional, peka terhadap kode sosial, serta memiliki tingkat kepatuhan yang tinggi terhadap aturan dan norma organisasi.",
    deskripsi: "Individu yang proaktif, mandiri, dan sangat komunikatif dalam kerja tim. Menunjukkan persistensi yang kuat dalam mengejar target dan memiliki daya tahan yang baik terhadap tekanan kerja (deadline). Mampu berpikir logis dan sistematis dalam memberikan solusi praktis atas permasalahan yang muncul.",
    rekomendasi: "Layak direkomendasikan untuk posisi staf ahli, pelaksana senior, atau peran operasional yang membutuhkan konsistensi, tanggung jawab mandiri, dan kemampuan problem-solving yang logis."
  },
  "Sangat Baik": {
    aspek: "Kontrol motorik sangat prima dengan garis yang mantap tanpa keraguan. Pengorganisasian objek sangat sistematis dan proporsional, mencerminkan intelegensi visual yang tinggi serta ketelitian luar biasa dalam menyusun rencana kerja.",
    interpretasi: "Menunjukkan stabilitas emosi yang luar biasa dan integritas yang sangat kuat. Subjek memiliki kepercayaan diri yang matang, konsentrasi tinggi, serta kemampuan adaptasi yang fleksibel namun tetap terukur sesuai dengan prinsip diri yang kokoh.",
    deskripsi: "Individu merupakan sosok penggerak dengan keterampilan interpersonal yang tinggi. Memiliki ambisi besar yang terukur, fokus pada pencapaian jangka panjang, dan sangat tangguh (resilient) saat menghadapi situasi krisis. Daya analisisnya sangat tajam, mampu melihat gambaran besar (big picture), dan sangat objektif dalam mengambil keputusan strategis.",
    rekomendasi: "Sangat direkomendasikan. Sangat cocok untuk posisi manajerial, pimpinan tim, atau posisi strategis lainnya yang membutuhkan ketahanan mental tinggi, kepemimpinan, dan tanggung jawab besar."
  }
};

// ------------------------------------------------------------
// WARTEGG: Narasi per Kotak (Skor 1-5)
// ------------------------------------------------------------
const DB_NARASI_WARTEGG = {
  1: { identitas: "Sangat kurang percaya diri.", sosial: "Sangat tertutup dan kaku.", ambisi: "Kurang arah tujuan.", beban: "Mudah tertekan masalah kecil.", vitalitas: "Energi rendah.", rasional: "Tidak terorganisir.", sensitivitas: "Apatis.", kontrol: "Mudah dipengaruhi." },
  2: { identitas: "Sering ragu-ragu.", sosial: "Pasif dalam interaksi.", ambisi: "Fokus mudah teralih.", beban: "Butuh bimbingan intensif.", vitalitas: "Semangat fluktuatif.", rasional: "Terjebak detail kecil.", sensitivitas: "Empati canggung.", kontrol: "Disiplin jika diawasi." },
  3: { identitas: "Cukup percaya diri.", sosial: "Sosialisasi lingkungan dikenal.", ambisi: "Maju namun stabil.", beban: "Mampu hadapi rutin harian.", vitalitas: "Energi cukup standar.", rasional: "Logis tapi kurang dalam.", sensitivitas: "Empati wajar.", kontrol: "Kepatuhan cukup baik." },
  4: { identitas: "Percaya diri stabil.", sosial: "Proaktif dalam tim.", ambisi: "Persistensi mengejar target.", beban: "Tangguh hadapi deadline.", vitalitas: "Antusias dan asertif.", rasional: "Sistematis dan solutif.", sensitivitas: "Mata emosional baik.", kontrol: "Disiplin tinggi." },
  5: { identitas: "Sangat percaya diri.", sosial: "Sangat supel/penggerak.", ambisi: "Ambisi besar dan fokus.", beban: "Sangat resilient/tenang.", vitalitas: "Vitalitas tinggi.", rasional: "Tajam dan objektif.", sensitivitas: "Bijak kelola emosi.", kontrol: "Disiplin sangat tinggi." }
};


// ------------------------------------------------------------
// HTP: Narasi Aspek & Kesimpulan - ORANG
// ------------------------------------------------------------
const DB_NARASI_HTP_ORANG = {
  pro: {
    "1": "Proporsi gambar sangat buruk; ukuran antar bagian tubuh tidak logis dan gambar terlalu kecil/besar secara ekstrem.",
    "2": "Proporsi gambar kurang seimbang; terdapat ketimpangan ukuran yang mencolok pada bagian tubuh tertentu.",
    "3": "Proporsi gambar berada pada level rata-rata; ukuran bagian tubuh cukup serasi dengan bidang kertas.",
    "4": "Proporsi gambar baik; pembagian ukuran antar elemen tubuh terlihat harmonis dan terencana.",
    "5": "Proporsi gambar sangat ideal; anatomi tubuh digambarkan dengan keseimbangan visual yang sempurna."
  },
  detl: {
    "1": "Detail sangat minim; gambar hanya berupa garis dasar tanpa elemen wajah atau anggota tubuh yang jelas.",
    "2": "Detail kurang memadai; hanya menampilkan elemen tubuh besar tanpa adanya jari, telinga, atau pakaian.",
    "3": "Detail cukup lengkap; elemen wajah dan anggota tubuh dasar sudah terpenuhi secara umum.",
    "4": "Detail gambar baik; terdapat penambahan aksesoris, pakaian, atau tekstur rambut yang memperjelas identitas.",
    "5": "Detail sangat kaya dan teliti; setiap bagian tubuh hingga aksesoris terkecil digambarkan dengan sangat lengkap."
  },
  pers: {
    "1": "Perspektif sangat buruk; gambar terlihat melayang, terpotong pinggir kertas, atau memiliki kemiringan ekstrem.",
    "2": "Perspektif kurang stabil; posisi gambar cenderung terlalu ke pinggir atau sudut bawah kertas.",
    "3": "Perspektif cukup baik; gambar ditempatkan secara wajar dengan sudut pandang dua dimensi yang stabil.",
    "4": "Perspektif baik; gambar diletakkan secara sentral (tengah) menunjukkan orientasi diri yang stabil.",
    "5": "Perspektif sangat baik; penggunaan sudut pandang yang matang dan penempatan posisi yang sangat strategis."
  },
  line: {
    "1": "Kualitas garis sangat buruk; terlihat coretan kasar, penuh hapusan, atau garis yang tumpang tindih tidak beraturan.",
    "2": "Kualitas garis kurang stabil; tarikan garis terlihat ragu-ragu, putus-putus, atau terlalu tipis (samar).",
    "3": "Kualitas garis cukup baik; tarikan garis terlihat lancar meskipun di beberapa bagian masih terdapat keraguan.",
    "4": "Kualitas garis tegas dan mantap; menunjukkan kontrol motorik yang baik dan kepercayaan diri dalam menggambar.",
    "5": "Kualitas garis sangat prima; tarikan garis sangat bersih, mengalir, dan memiliki tekanan yang konsisten."
  }
};

const DB_KESIMPULAN_HTP_ORANG = {
  "Rendah": {
    teknis: "Goresan garis tampak sangat ragu, terputus-putus, atau terlalu ditekan secara ekstrem. Kontrol motorik halus belum stabil.",
    konten: "Objek digambarkan sangat minimalis atau jauh dari bentuk anatomi yang seharusnya. Banyak elemen penting yang hilang.",
    simbolis: "Indikasi adanya hambatan ekspresi diri, rasa kurang percaya diri yang kuat, atau kecemasan dalam menghadapi tugas.",
    observasi: "Perlu pendampingan lebih lanjut untuk melatih keberanian dalam menarik garis dan mengekspresikan objek secara utuh."
  },
  "Cukup": {
    teknis: "Goresan garis sudah cukup lancar meskipun di beberapa bagian masih terdapat keraguan atau tarikan yang samar.",
    konten: "Objek sudah dapat dikenali dengan baik. Elemen dasar sudah terpenuhi meski belum terlalu mendalam.",
    simbolis: "Menunjukkan stabilitas emosi yang rata-rata. Subjek mampu menyesuaikan diri namun masih berhati-hati.",
    observasi: "Subjek memiliki potensi untuk berkembang jika diberikan stimulasi pada detail dan ketegasan dalam bekerja."
  },
  "Baik": {
    teknis: "Kualitas garis tegas, bersih, dan mantap. Menunjukkan koordinasi motorik dan kontrol diri yang sangat baik.",
    konten: "Detail objek sangat kaya, proporsional, dan terorganisir dengan jelas. Subjek memperhatikan lingkungan sekitar.",
    simbolis: "Mencerminkan rasa percaya diri yang tinggi, kematangan emosional, dan kemampuan sosialisasi yang sehat.",
    observasi: "Subjek menunjukkan antusiasme dan fokus yang baik dalam menyelesaikan tugas menggambar."
  },
  "Sangat Baik": {
    teknis: "Goresan sangat artistik, dinamis, dan memiliki variasi tekanan yang menunjukkan kecerdasan kinestetik yang tinggi.",
    konten: "Penyajian konten sangat komprehensif, kreatif, dan memiliki perspektif yang matang di atas rata-rata.",
    simbolis: "Kepribadian yang sangat stabil, integritas diri yang kuat, serta kapasitas intelektual dan imajinasi yang luar biasa.",
    observasi: "Hasil karya menunjukkan kematangan psikologis yang prima dan kemampuan analisis ruang yang sangat tajam."
  }
};


// ------------------------------------------------------------
// HTP: Narasi Aspek & Kesimpulan - RUMAH
// ------------------------------------------------------------
const DB_NARASI_HTP_RUMAH = {
  pro: {
    "1": "Proporsi rumah sangat tidak seimbang; ukuran pintu, jendela, atau atap tidak masuk akal (terlalu kecil/besar).",
    "2": "Proporsi kurang stabil; terdapat ketimpangan antara luas dinding dengan tinggi atap yang mencolok.",
    "3": "Proporsi rumah cukup wajar; perbandingan ukuran elemen utama terlihat harmonis secara umum.",
    "4": "Proporsi rumah baik; pembagian ruang dan ukuran jendela/pintu terlihat sangat terencana.",
    "5": "Proporsi rumah sangat ideal; pembagian bidang sangat akurat menunjukkan perencanaan yang matang."
  },
  detl: {
    "1": "Detail sangat minim; hanya berupa garis kotak dasar tanpa adanya jendela, pintu, atau cerobong asap.",
    "2": "Detail kurang memadai; elemen seperti gagang pintu, tirai, atau tekstur atap tidak digambarkan.",
    "3": "Detail cukup lengkap; elemen utama rumah (pintu, jendela, atap) sudah tersedia dengan jelas.",
    "4": "Detail baik; terdapat penambahan detail seperti tanaman, pagar, atau dekorasi dinding rumah.",
    "5": "Detail sangat kaya; setiap elemen kecil seperti engsel pintu hingga tekstur bata digambarkan dengan teliti."
  },
  pers: {
    "1": "Perspektif buruk; rumah terlihat miring atau melayang tanpa dasar tanah yang jelas.",
    "2": "Perspektif kurang stabil; sudut pandang rumah tampak aneh (distorsi) atau terlalu di pojok kertas.",
    "3": "Perspektif cukup baik; rumah digambarkan dari sudut pandang depan yang stabil dan jelas.",
    "4": "Perspektif baik; rumah diletakkan di tengah dengan kesan kedalaman (tiga dimensi) yang baik.",
    "5": "Perspektif sangat baik; penggunaan sudut pandang yang matang menunjukkan orientasi ruang yang sangat prima."
  },
  line: {
    "1": "Kualitas garis sangat buruk; banyak coretan kasar, garis dinding tidak lurus, atau banyak hapusan.",
    "2": "Kualitas garis kurang stabil; tarikan garis terlihat ragu-ragu atau terlalu tipis sehingga sulit terlihat.",
    "3": "Kualitas garis cukup tegas; garis-garis pembentuk rumah ditarik dengan kelancaran yang wajar.",
    "4": "Kualitas garis mantap; tarikan garis lurus dan berani menunjukkan kontrol emosi yang stabil.",
    "5": "Kualitas garis sangat prima; tarikan garis bersih, menyambung sempurna, dan memiliki tekanan yang konsisten."
  }
};

const DB_KESIMPULAN_HTP_RUMAH = {
  "Rendah": {
    teknis: "Garis dinding tidak stabil dan cenderung rapuh. Menunjukkan kurangnya kontrol motorik dalam membangun struktur visual yang kokoh.",
    konten: "Elemen rumah sangat minim (tanpa pintu/jendela). Menunjukkan adanya hambatan dalam interaksi dengan lingkungan luar.",
    simbolis: "Mencerminkan rasa tidak aman (insecurity) di lingkungan rumah atau adanya konflik dalam hubungan keluarga.",
    observasi: "Subjek tampak ragu-ragu dan menutup diri. Ada kecenderungan menarik diri dari lingkungan sosial."
  },
  "Cukup": {
    teknis: "Struktur rumah sudah terbentuk dengan cukup baik, meski ada beberapa garis yang tumpang tindih atau kurang presisi.",
    konten: "Elemen dasar rumah (atap, pintu, jendela) sudah tersedia. Menunjukkan kemampuan adaptasi sosial yang rata-rata.",
    simbolis: "Menunjukkan stabilitas emosional yang cukup, namun masih terdapat kecemasan ringan dalam urusan domestik/keluarga.",
    observasi: "Subjek kooperatif dalam mengerjakan tugas dan mampu mengikuti instruksi standar dengan hasil yang wajar."
  },
  "Baik": {
    teknis: "Garis bangunan sangat tegas, lurus, dan mantap. Menunjukkan ego yang kuat dan kontrol diri yang sangat stabil.",
    konten: "Rumah digambarkan dengan lengkap, termasuk detail tambahan (jalan, tanaman). Menunjukkan keterbukaan terhadap dunia luar.",
    simbolis: "Mencerminkan kebahagiaan di lingkungan rumah, rasa percaya diri, dan hubungan keluarga yang harmonis.",
    observasi: "Subjek menunjukkan fokus yang tinggi dan kepercayaan diri yang baik selama proses menggambar."
  },
  "Sangat Baik": {
    teknis: "Perspektif dan proporsi bangunan sangat matang (3D). Menunjukkan kecerdasan spasial dan perencanaan yang sangat luar biasa.",
    konten: "Detail sangat komprehensif dan kreatif. Menunjukkan kapasitas intelektual yang tinggi dan perhatian terhadap detail hidup.",
    simbolis: "Mencerminkan kematangan pribadi yang prima, integritas diri yang kuat, dan keseimbangan hidup yang sangat baik.",
    observasi: "Hasil karya menunjukkan kreativitas yang tinggi dan kemampuan analisis lingkungan yang tajam."
  }
};


// ------------------------------------------------------------
// HTP: Narasi Aspek & Kesimpulan - POHON
// ------------------------------------------------------------
const DB_NARASI_HTP_POHON = {
  pro: {
    "1": "Ketidakseimbangan ekstrem antara batang dan tajuk (daun); pohon tampak rapuh dan tidak mampu menopang dirinya sendiri secara visual.",
    "2": "Proporsi kurang stabil; ukuran dahan atau akar tidak sinkron dengan besar batang, menunjukkan adanya hambatan dalam penyaluran energi diri.",
    "3": "Proporsi pohon berada pada level fungsional; rasio antara tinggi batang dan lebar tajuk mencerminkan keseimbangan psikis yang cukup wajar.",
    "4": "Proporsi pohon sangat baik; struktur dahan dan daun terlihat harmonis, mencerminkan pertumbuhan pribadi yang terencana dan stabil.",
    "5": "Proporsi sangat ideal dan kokoh; menunjukkan integrasi kepribadian yang matang, vitalitas tinggi, dan kemampuan mengelola potensi diri secara maksimal."
  },
  detl: {
    "1": "Detail sangat minim (pohon gundul); ketiadaan dahan, daun, atau akar menunjukkan kurangnya gairah hidup atau penarikan diri dari lingkungan.",
    "2": "Detail kurang memadai; elemen pertumbuhan seperti ranting atau urat kayu tidak ditampilkan, indikasi kurangnya minat pada pengembangan diri.",
    "3": "Detail cukup lengkap; dahan dan tajuk tergambar jelas sebagai simbol keinginan untuk tumbuh dan berinteraksi dengan dunia luar.",
    "4": "Detail baik; terdapat penambahan tekstur kulit kayu, buah, atau dedaunan yang mencerminkan kekayaan mental dan produktivitas.",
    "5": "Detail sangat kaya dan observatif; penggambaran akar yang kuat hingga pucuk daun terkecil menunjukkan ketelitian dan kreativitas yang luar biasa."
  },
  pers: {
    "1": "Perspektif sangat buruk; pohon tampak miring ekstrem, melayang, atau terpotong bidang kertas, indikasi adanya tekanan psikologis yang kuat.",
    "2": "Perspektif kurang stabil; penempatan pohon cenderung terlalu ke sudut bawah, mencerminkan rasa kurang percaya diri terhadap masa depan.",
    "3": "Perspektif cukup baik; pohon berdiri tegak di pusat bidang kertas, menunjukkan prinsip hidup yang stabil dan orientasi diri yang normal.",
    "4": "Perspektif sangat baik; penggunaan ruang yang efisien menunjukkan kemampuan subjek dalam menempatkan diri secara strategis di lingkungannya.",
    "5": "Perspektif sangat matang; penyajian pohon yang kokoh dan berwibawa mencerminkan dominasi diri yang positif dan visi hidup yang sangat jelas."
  },
  line: {
    "1": "Kualitas garis sangat buruk; tarikan garis batang terlihat kasar, penuh pengulangan, atau sangat tipis (samar), indikasi kecemasan internal.",
    "2": "Kualitas garis kurang stabil; garis dahan tampak terputus-putus atau ragu-ragu, mencerminkan aliran energi yang sering terhambat oleh keraguan diri.",
    "3": "Kualitas garis cukup tegas; tarikan garis mengalir secara wajar menunjukkan kontrol motorik dan emosional yang cukup baik.",
    "4": "Kualitas garis mantap dan berani; tarikan garis tanpa hapusan menunjukkan kepercayaan diri dan ketegasan dalam memegang prinsip hidup.",
    "5": "Kualitas garis sangat prima; garis sangat bersih, tajam, dan konsisten, mencerminkan integritas kepribadian yang kuat dan energi psikis yang melimpah."
  }
};

const DB_KESIMPULAN_HTP_POHON = {
  "Sangat Baik": {
    teknis: "Kontrol garis dan presisi struktur pohon sangat luar biasa. Ini mencerminkan koordinasi motorik yang matang dan ketegasan dalam prinsip hidup.",
    konten: "Tajuk yang lebat dan detail yang kaya menunjukkan individu yang memiliki vitalitas tinggi, kreatif, serta kaya akan ide dan produktivitas kerja.",
    simbolis: "Secara simbolis, pohon yang kokoh dengan akar kuat melambangkan kepribadian yang stabil, memiliki pijakan hidup yang sangat jelas, dan optimisme tinggi.",
    observasi: "Subjek menunjukkan potensi kepemimpinan dan ketahanan mental yang sangat kuat (resilience). Sangat siap menghadapi tantangan besar."
  },
  "Baik": {
    teknis: "Struktur pohon tergambar dengan mantap. Garis yang tegas mencerminkan kepercayaan diri yang baik dan kemampuan mengelola stres secara efektif.",
    konten: "Elemen pohon yang lengkap menunjukkan subjek memiliki minat besar pada pengembangan diri dan keterbukaan terhadap informasi baru.",
    simbolis: "Mencerminkan individu yang adaptif dan memiliki hubungan yang sehat antara masa lalu (akar) dan masa depan (tajuk).",
    observasi: "Menunjukkan fokus yang stabil dan motivasi kerja yang konsisten. Mampu bekerja secara mandiri maupun dalam tim."
  },
  "Cukup": {
    teknis: "Kemampuan teknis berada pada level fungsional. Meskipun terdapat sedikit keraguan pada garis dahan, struktur dasar pohon tetap terjaga stabil.",
    konten: "Objek dasar sudah terpenuhi. Subjek memiliki energi yang cukup untuk menjalankan tugas, meskipun terkadang memerlukan dorongan eksternal.",
    simbolis: "Menunjukkan profil psikologis yang normatif. Subjek mampu menyesuaikan diri dengan aturan lingkungan tanpa banyak hambatan emosional.",
    observasi: "Kooperatif dan mengikuti instruksi dengan baik. Disarankan untuk lebih mengeksplorasi potensi diri agar lebih berani dalam berinovasi."
  },
  "Rendah": {
    teknis: "Garis yang samar atau terputus mengindikasikan adanya kelelahan mental atau tekanan psikis yang membuat subjek merasa kurang bertenaga.",
    konten: "Penyajian pohon yang sangat minimalis mencerminkan kurangnya motivasi saat ini atau adanya hambatan dalam mengekspresikan bakat diri.",
    simbolis: "Terdapat indikasi rasa tidak aman atau ketergantungan pada lingkungan. Akar yang lemah melambangkan kurangnya fondasi kepercayaan diri.",
    observasi: "Dianjurkan untuk mendapatkan lingkungan kerja yang lebih suportif dan instruksi yang sangat jelas guna mengurangi kecemasan dalam bertindak."
  }
};


// ------------------------------------------------------------
// HTP: Narasi Aspek & Kesimpulan - GABUNGAN (H+T+P)
// ------------------------------------------------------------
const DB_NARASI_HTP_GABUNG = {
  pro: {
    "1": "Skala antar objek sangat kacau; ukuran orang tampak jauh lebih besar dari rumah atau sebaliknya, menunjukkan kesulitan dalam memandang realitas secara proporsional.",
    "2": "Proporsi antar elemen kurang harmonis; terdapat ketimpangan ukuran yang mencolok, mengindikasikan adanya prioritas emosional yang tidak stabil.",
    "3": "Skala antar objek cukup logis; perbandingan ukuran antara orang, rumah, dan pohon terlihat wajar dan dapat diterima secara visual.",
    "4": "Proporsi gambar sangat baik; pembagian ukuran antar elemen menciptakan komposisi cerita yang harmonis dan terencana.",
    "5": "Proporsi sangat ideal dan akurat; menunjukkan kemampuan analisis situasi yang tajam dan cara pandang yang sangat objektif terhadap kehidupan."
  },
  detl: {
    "1": "Interaksi antar objek sangat minim; objek digambarkan terpisah jauh tanpa keterkaitan, menunjukkan hambatan dalam mengintegrasikan berbagai aspek kehidupan.",
    "2": "Detail interaksi kurang memadai; objek hanya diletakkan berdekatan tanpa adanya elemen penghubung seperti jalan atau aktivitas yang jelas.",
    "3": "Detail interaksi cukup lengkap; objek tersusun membentuk satu kesatuan lingkungan yang fungsional dan mudah dipahami.",
    "4": "Detail gambar sangat baik; terdapat elemen pendukung yang memperkuat narasi (seperti orang sedang merawat pohon atau masuk ke rumah).",
    "5": "Detail sangat komprehensif; setiap elemen saling mendukung dalam satu komposisi yang kaya, menunjukkan kecerdasan sosial dan empati yang tinggi."
  },
  pers: {
    "1": "Tata letak sangat berantakan; objek terlihat bertumpuk atau tersebar tanpa orientasi yang jelas, mencerminkan kebingungan dalam menentukan peran diri.",
    "2": "Perspektif kurang stabil; penempatan objek tidak memiliki pusat perhatian yang jelas, indikasi adanya kecemasan dalam menghadapi lingkungan luas.",
    "3": "Perspektif cukup baik; seluruh objek ditempatkan secara seimbang dalam bidang gambar, menunjukkan stabilitas emosional yang normal.",
    "4": "Perspektif sangat baik; pengaturan ruang menunjukkan kemampuan subjek dalam mengorganisir berbagai aspek hidup secara strategis.",
    "5": "Penggunaan ruang sangat cerdas dan dinamis; menciptakan kedalaman komposisi yang matang, mencerminkan kematangan mental dan visi hidup yang kuat."
  },
  line: {
    "1": "Kualitas garis tidak konsisten di seluruh objek; coretan kasar dan penuh hapusan menunjukkan adanya konflik internal yang mendalam.",
    "2": "Kualitas garis kurang stabil; tarikan garis tampak ragu-ragu di semua objek, mencerminkan rasa kurang aman dalam mengambil tanggung jawab.",
    "3": "Kualitas garis cukup tegas secara menyeluruh; tarikan garis lancar menunjukkan kontrol diri yang konsisten di berbagai situasi.",
    "4": "Kualitas garis sangat mantap; menunjukkan kepercayaan diri yang tinggi dalam mengelola hubungan sosial dan tugas-tugas pribadi.",
    "5": "Kualitas garis sangat prima; tarikan garis bersih dan menyatu secara artistik, mencerminkan kepribadian yang utuh, tangguh, dan sangat stabil."
  }
};

const DB_KESIMPULAN_HTP_GABUNG = {
  "Sangat Baik": {
    teknis: "Harmoni garis dan komposisi ruang sangat luar biasa. Ini mencerminkan individu dengan perencanaan strategis yang sangat matang dan kontrol emosional yang sempurna.",
    konten: "Interaksi antar objek yang sangat detail menunjukkan kemampuan luar biasa dalam menyelaraskan peran diri, kehidupan keluarga, dan ambisi pribadi.",
    simbolis: "Mencerminkan keseimbangan hidup yang ideal. Subjek memiliki integritas diri yang kuat serta mampu menempatkan diri sebagai pusat kendali yang positif dalam lingkungannya.",
    observasi: "Individu yang sangat cerdas secara emosional dan sosial. Sangat efektif dalam mengelola tim dan menangani situasi yang kompleks secara tenang."
  },
  "Baik": {
    teknis: "Struktur gambar terpadu dengan sangat baik. Garis yang tegas di semua objek mencerminkan kepercayaan diri yang konsisten dan kemandirian yang tinggi.",
    konten: "Penyajian elemen yang lengkap menunjukkan subjek memiliki wawasan yang luas dan perhatian yang tulus terhadap kualitas hidup dan hubungan sosial.",
    simbolis: "Mencerminkan keharmonisan antara aspirasi pribadi dengan realitas sosial. Subjek merasa aman dengan dirinya sendiri dan lingkungan sekitarnya.",
    observasi: "Menunjukkan stabilitas kerja dan kemampuan adaptasi yang sangat baik. Mampu menjaga keseimbangan antara tanggung jawab pekerjaan dan kehidupan pribadi."
  },
  "Cukup": {
    teknis: "Komposisi gambar berada pada level fungsional. Meskipun sederhana, subjek mampu menyusun elemen-elemen hidup secara logis dan teratur.",
    konten: "Interaksi antar objek sudah terlihat memadai. Subjek menunjukkan usaha untuk bersosialisasi dan menjalankan perannya dengan norma yang berlaku.",
    simbolis: "Menunjukkan profil psikologis yang seimbang namun cenderung bermain aman. Subjek memilih untuk mengikuti jalur yang sudah ada daripada mengambil risiko besar.",
    observasi: "Dapat diandalkan dalam tugas rutin dan instruksi standar. Memerlukan sedikit dorongan untuk meningkatkan kreativitas dan inisiatif mandiri."
  },
  "Rendah": {
    teknis: "Komposisi yang terfragmentasi atau garis yang goyah menunjukkan adanya kesulitan dalam mengintegrasikan berbagai tekanan hidup saat ini.",
    konten: "Objek yang digambarkan terisolasi satu sama lain mencerminkan adanya perasaan kesepian atau hambatan dalam membangun relasi yang bermakna.",
    simbolis: "Indikasi adanya kelelahan mental atau konflik antara keinginan pribadi dengan tuntutan lingkungan yang dirasa terlalu berat.",
    observasi: "Sangat disarankan untuk diberikan lingkungan yang suportif dan ruang untuk refleksi diri guna membangun kembali motivasi dan rasa percaya dirinya."
  }
};


// ------------------------------------------------------------
// HTP: Lookup Map (digunakan oleh TesHTP.gs)
// ------------------------------------------------------------
const HTP_DB_MAP = {
  orang:  { narasi: DB_NARASI_HTP_ORANG,  kesimpulan: DB_KESIMPULAN_HTP_ORANG  },
  rumah:  { narasi: DB_NARASI_HTP_RUMAH,  kesimpulan: DB_KESIMPULAN_HTP_RUMAH  },
  pohon:  { narasi: DB_NARASI_HTP_POHON,  kesimpulan: DB_KESIMPULAN_HTP_POHON  },
  gabung: { narasi: DB_NARASI_HTP_GABUNG, kesimpulan: DB_KESIMPULAN_HTP_GABUNG }
};