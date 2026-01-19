/* ===========================================
   Province-City Data for Indonesia
   =========================================== */

// Complete Indonesian province and city/kabupaten data
const provinceCityData = {
    "Aceh": ["Banda Aceh", "Sabang", "Langsa", "Lhokseumawe", "Subulussalam", "Aceh Besar", "Aceh Barat", "Aceh Barat Daya", "Aceh Jaya", "Aceh Selatan", "Aceh Singkil", "Aceh Tamiang", "Aceh Tengah", "Aceh Tenggara", "Aceh Timur", "Aceh Utara", "Bener Meriah", "Bireuen", "Gayo Lues", "Nagan Raya", "Pidie", "Pidie Jaya", "Simeulue"],
    "Sumatera Utara": ["Medan", "Binjai", "Pematang Siantar", "Tanjungbalai", "Tebing Tinggi", "Padang Sidempuan", "Sibolga", "Gunungsitoli", "Asahan", "Batubara", "Dairi", "Deli Serdang", "Humbang Hasundutan", "Karo", "Labuhanbatu", "Labuhanbatu Selatan", "Labuhanbatu Utara", "Langkat", "Mandailing Natal", "Nias", "Nias Barat", "Nias Selatan", "Nias Utara", "Padang Lawas", "Padang Lawas Utara", "Pakpak Bharat", "Samosir", "Serdang Bedagai", "Simalungun", "Tapanuli Selatan", "Tapanuli Tengah", "Tapanuli Utara", "Toba Samosir"],
    "Sumatera Barat": ["Padang", "Bukittinggi", "Padangpanjang", "Pariaman", "Payakumbuh", "Sawahlunto", "Solok", "Agam", "Dharmasraya", "Kepulauan Mentawai", "Lima Puluh Kota", "Padang Pariaman", "Pasaman", "Pasaman Barat", "Pesisir Selatan", "Sijunjung", "Solok", "Solok Selatan", "Tanah Datar"],
    "Riau": ["Pekanbaru", "Dumai", "Bengkalis", "Indragiri Hilir", "Indragiri Hulu", "Kampar", "Kepulauan Meranti", "Kuantan Singingi", "Pelalawan", "Rokan Hilir", "Rokan Hulu", "Siak"],
    "Kepulauan Riau": ["Batam", "Tanjungpinang", "Bintan", "Karimun", "Kepulauan Anambas", "Lingga", "Natuna"],
    "Jambi": ["Jambi", "Sungai Penuh", "Batanghari", "Bungo", "Kerinci", "Merangin", "Muaro Jambi", "Sarolangun", "Tanjung Jabung Barat", "Tanjung Jabung Timur", "Tebo"],
    "Sumatera Selatan": ["Palembang", "Prabumulih", "Pagar Alam", "Lubuklinggau", "Banyuasin", "Empat Lawang", "Lahat", "Muara Enim", "Musi Banyuasin", "Musi Rawas", "Musi Rawas Utara", "Ogan Ilir", "Ogan Komering Ilir", "Ogan Komering Ulu", "Ogan Komering Ulu Selatan", "Ogan Komering Ulu Timur", "Penukal Abab Lematang Ilir"],
    "Bengkulu": ["Bengkulu", "Bengkulu Selatan", "Bengkulu Tengah", "Bengkulu Utara", "Kaur", "Kepahiang", "Lebong", "Mukomuko", "Rejang Lebong", "Seluma"],
    "Lampung": ["Bandar Lampung", "Metro", "Lampung Barat", "Lampung Selatan", "Lampung Tengah", "Lampung Timur", "Lampung Utara", "Mesuji", "Pesawaran", "Pesisir Barat", "Pringsewu", "Tanggamus", "Tulang Bawang", "Tulang Bawang Barat", "Way Kanan"],
    "Bangka Belitung": ["Pangkal Pinang", "Bangka", "Bangka Barat", "Bangka Selatan", "Bangka Tengah", "Belitung", "Belitung Timur"],
    "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"],
    "Banten": ["Serang", "Cilegon", "Tangerang", "Tangerang Selatan", "Lebak", "Pandeglang", "Serang"],
    "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Cimahi", "Cirebon", "Depok", "Sukabumi", "Tasikmalaya", "Banjar", "Bandung", "Bandung Barat", "Bekasi", "Bogor", "Ciamis", "Cianjur", "Cirebon", "Garut", "Indramayu", "Karawang", "Kuningan", "Majalengka", "Pangandaran", "Purwakarta", "Subang", "Sukabumi", "Sumedang", "Tasikmalaya"],
    "Jawa Tengah": ["Semarang", "Surakarta", "Magelang", "Salatiga", "Pekalongan", "Tegal", "Banjarnegara", "Banyumas", "Batang", "Blora", "Boyolali", "Brebes", "Cilacap", "Demak", "Grobogan", "Jepara", "Karanganyar", "Kebumen", "Kendal", "Klaten", "Kudus", "Magelang", "Pati", "Pekalongan", "Pemalang", "Purbalingga", "Purworejo", "Rembang", "Semarang", "Sragen", "Sukoharjo", "Tegal", "Temanggung", "Wonogiri", "Wonosobo"],
    "DI Yogyakarta": ["Yogyakarta", "Bantul", "Gunungkidul", "Kulon Progo", "Sleman"],
    "Jawa Timur": ["Surabaya", "Malang", "Batu", "Blitar", "Kediri", "Madiun", "Mojokerto", "Pasuruan", "Probolinggo", "Bangkalan", "Banyuwangi", "Blitar", "Bojonegoro", "Bondowoso", "Gresik", "Jember", "Jombang", "Kediri", "Lamongan", "Lumajang", "Madiun", "Magetan", "Malang", "Mojokerto", "Nganjuk", "Ngawi", "Pacitan", "Pamekasan", "Pasuruan", "Ponorogo", "Probolinggo", "Sampang", "Sidoarjo", "Situbondo", "Sumenep", "Trenggalek", "Tuban", "Tulungagung"],
    "Bali": ["Denpasar", "Badung", "Bangli", "Buleleng", "Gianyar", "Jembrana", "Karangasem", "Klungkung", "Tabanan"],
    "Nusa Tenggara Barat": ["Mataram", "Bima", "Bima", "Dompu", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Lombok Utara", "Sumbawa", "Sumbawa Barat"],
    "Nusa Tenggara Timur": ["Kupang", "Alor", "Belu", "Ende", "Flores Timur", "Kupang", "Lembata", "Malaka", "Manggarai", "Manggarai Barat", "Manggarai Timur", "Nagekeo", "Ngada", "Rote Ndao", "Sabu Raijua", "Sikka", "Sumba Barat", "Sumba Barat Daya", "Sumba Tengah", "Sumba Timur", "Timor Tengah Selatan", "Timor Tengah Utara"],
    "Kalimantan Barat": ["Pontianak", "Singkawang", "Bengkayang", "Kapuas Hulu", "Kayong Utara", "Ketapang", "Kubu Raya", "Landak", "Melawi", "Mempawah", "Sambas", "Sanggau", "Sekadau", "Sintang"],
    "Kalimantan Tengah": ["Palangkaraya", "Barito Selatan", "Barito Timur", "Barito Utara", "Gunung Mas", "Kapuas", "Katingan", "Kotawaringin Barat", "Kotawaringin Timur", "Lamandau", "Murung Raya", "Pulang Pisau", "Seruyan", "Sukamara"],
    "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru", "Balangan", "Banjar", "Barito Kuala", "Hulu Sungai Selatan", "Hulu Sungai Tengah", "Hulu Sungai Utara", "Kotabaru", "Tabalong", "Tanah Bumbu", "Tanah Laut", "Tapin"],
    "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang", "Berau", "Kutai Barat", "Kutai Kartanegara", "Kutai Timur", "Mahakam Ulu", "Paser", "Penajam Paser Utara"],
    "Kalimantan Utara": ["Tarakan", "Bulungan", "Malinau", "Nunukan", "Tana Tidung"],
    "Sulawesi Utara": ["Manado", "Bitung", "Kotamobagu", "Tomohon", "Bolaang Mongondow", "Bolaang Mongondow Selatan", "Bolaang Mongondow Timur", "Bolaang Mongondow Utara", "Kepulauan Sangihe", "Kepulauan Siau Tagulandang Biaro", "Kepulauan Talaud", "Minahasa", "Minahasa Selatan", "Minahasa Tenggara", "Minahasa Utara"],
    "Gorontalo": ["Gorontalo", "Boalemo", "Bone Bolango", "Gorontalo", "Gorontalo Utara", "Pohuwato"],
    "Sulawesi Tengah": ["Palu", "Banggai", "Banggai Kepulauan", "Banggai Laut", "Buol", "Donggala", "Morowali", "Morowali Utara", "Parigi Moutong", "Poso", "Sigi", "Tojo Una-Una", "Tolitoli"],
    "Sulawesi Barat": ["Mamuju", "Majene", "Mamasa", "Mamuju Tengah", "Pasangkayu", "Polewali Mandar"],
    "Sulawesi Selatan": ["Makassar", "Palopo", "Parepare", "Bantaeng", "Barru", "Bone", "Bulukumba", "Enrekang", "Gowa", "Jeneponto", "Kepulauan Selayar", "Luwu", "Luwu Timur", "Luwu Utara", "Maros", "Pangkajene dan Kepulauan", "Pinrang", "Sidenreng Rappang", "Sinjai", "Soppeng", "Takalar", "Tana Toraja", "Toraja Utara", "Wajo"],
    "Sulawesi Tenggara": ["Kendari", "Bau-Bau", "Bombana", "Buton", "Buton Selatan", "Buton Tengah", "Buton Utara", "Kolaka", "Kolaka Timur", "Kolaka Utara", "Konawe", "Konawe Kepulauan", "Konawe Selatan", "Konawe Utara", "Muna", "Muna Barat", "Wakatobi"],
    "Maluku": ["Ambon", "Tual", "Buru", "Buru Selatan", "Kepulauan Aru", "Maluku Barat Daya", "Maluku Tengah", "Maluku Tenggara", "Maluku Tenggara Barat", "Seram Bagian Barat", "Seram Bagian Timur"],
    "Maluku Utara": ["Ternate", "Tidore Kepulauan", "Halmahera Barat", "Halmahera Selatan", "Halmahera Tengah", "Halmahera Timur", "Halmahera Utara", "Kepulauan Sula", "Pulau Morotai", "Pulau Taliabu"],
    "Papua Barat": ["Manokwari", "Sorong", "Fakfak", "Kaimana", "Manokwari Selatan", "Pegunungan Arfak", "Sorong", "Sorong Selatan", "Tambrauw", "Teluk Bintuni", "Teluk Wondama"],
    "Papua": ["Jayapura", "Biak Numfor", "Jayapura", "Jayawijaya", "Keerom", "Kepulauan Yapen", "Lanny Jaya", "Mamberamo Raya", "Mamberamo Tengah", "Merauke", "Nduga", "Paniai", "Pegunungan Bintang", "Puncak", "Puncak Jaya", "Sarmi", "Supiori", "Tolikara", "Waropen", "Yahukimo", "Yalimo"],
    "Papua Barat Daya": ["Sorong", "Maybrat", "Raja Ampat", "Sorong Selatan", "Tambrauw"],
    "Papua Tengah": ["Nabire", "Deiyai", "Dogiyai", "Intan Jaya", "Mimika", "Paniai", "Puncak", "Puncak Jaya"],
    "Papua Pegunungan": ["Wamena", "Jayawijaya", "Lanny Jaya", "Mamberamo Tengah", "Nduga", "Pegunungan Bintang", "Tolikara", "Yahukimo", "Yalimo"],
    "Papua Selatan": ["Merauke", "Asmat", "Boven Digoel", "Mappi"]
};

// Province dropdown change handler
document.addEventListener('DOMContentLoaded', function () {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');

    if (provinceSelect && citySelect) {
        provinceSelect.addEventListener('change', function () {
            const selectedProvince = this.value;

            // Clear existing options
            citySelect.innerHTML = '';

            if (selectedProvince && provinceCityData[selectedProvince]) {
                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Pilih Kota/Kabupaten';
                citySelect.appendChild(defaultOption);

                // Add city options
                provinceCityData[selectedProvince].forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } else {
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Pilih Provinsi terlebih dahulu';
                citySelect.appendChild(defaultOption);
            }
        });
    }
});

// Function to set city value after province is loaded
function setCityValue(cityValue) {
    const citySelect = document.getElementById('city');
    if (citySelect && cityValue) {
        setTimeout(() => {
            citySelect.value = cityValue;
        }, 100);
    }
}
