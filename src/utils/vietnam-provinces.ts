// Dữ liệu tỉnh thành và quận huyện Việt Nam
export interface District {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
  districts: District[];
}

export const vietnamProvinces: Province[] = [
  {
    id: "01",
    name: "Hà Nội",
    districts: [
      { id: "001", name: "Quận Ba Đình" },
      { id: "002", name: "Quận Hoàn Kiếm" },
      { id: "003", name: "Quận Tây Hồ" },
      { id: "004", name: "Quận Long Biên" },
      { id: "005", name: "Quận Cầu Giấy" },
      { id: "006", name: "Quận Đống Đa" },
      { id: "007", name: "Quận Hai Bà Trưng" },
      { id: "008", name: "Quận Hoàng Mai" },
      { id: "009", name: "Quận Thanh Xuân" },
      { id: "016", name: "Huyện Sóc Sơn" },
      { id: "017", name: "Huyện Đông Anh" },
      { id: "018", name: "Huyện Gia Lâm" },
      { id: "019", name: "Quận Nam Từ Liêm" },
      { id: "020", name: "Quận Bắc Từ Liêm" },
      { id: "021", name: "Huyện Thanh Trì" },
      { id: "024", name: "Huyện Thường Tín" },
      { id: "025", name: "Huyện Phú Xuyên" },
      { id: "026", name: "Huyện Ứng Hòa" },
      { id: "027", name: "Huyện Mỹ Đức" },
      { id: "028", name: "Huyện Thạch Thất" },
      { id: "029", name: "Huyện Quốc Oai" },
      { id: "030", name: "Huyện Chương Mỹ" },
      { id: "031", name: "Huyện Đan Phượng" },
      { id: "032", name: "Huyện Hoài Đức" },
      { id: "033", name: "Huyện Thanh Oai" },
      { id: "034", name: "Huyện Mỹ Đức" },
      { id: "035", name: "Huyện Ứng Hòa" },
      { id: "036", name: "Huyện Thường Tín" },
      { id: "037", name: "Huyện Phú Xuyên" },
      { id: "038", name: "Huyện Phúc Thọ" },
      { id: "039", name: "Huyện Đan Phượng" },
      { id: "040", name: "Huyện Hoài Đức" },
      { id: "041", name: "Huyện Thạch Thất" },
      { id: "042", name: "Huyện Quốc Oai" },
      { id: "043", name: "Huyện Chương Mỹ" },
      { id: "044", name: "Huyện Thanh Oai" },
      { id: "045", name: "Huyện Thường Tín" },
      { id: "046", name: "Huyện Ứng Hòa" },
      { id: "047", name: "Huyện Mỹ Đức" },
      { id: "048", name: "Quận Hà Đông" },
      { id: "049", name: "Thị xã Sơn Tây" },
      { id: "050", name: "Huyện Ba Vì" },
      { id: "051", name: "Huyện Phúc Thọ" },
      { id: "052", name: "Huyện Đan Phượng" },
      { id: "053", name: "Huyện Hoài Đức" },
      { id: "054", name: "Huyện Quốc Oai" },
      { id: "055", name: "Huyện Thạch Thất" },
      { id: "056", name: "Huyện Chương Mỹ" },
      { id: "057", name: "Huyện Thanh Oai" },
      { id: "058", name: "Huyện Thường Tín" },
      { id: "059", name: "Huyện Phú Xuyên" },
      { id: "060", name: "Huyện Ứng Hòa" },
      { id: "061", name: "Huyện Mỹ Đức" },
      { id: "062", name: "Huyện An Khánh" },
      { id: "063", name: "Huyện Mê Linh" },
      { id: "064", name: "Quận Bắc Từ Liêm" },
      { id: "065", name: "Quận Nam Từ Liêm" },
      { id: "066", name: "Quận Cầu Giấy" },
      { id: "067", name: "Quận Hà Đông" },
      { id: "068", name: "Quận Hoàng Mai" },
      { id: "069", name: "Quận Long Biên" },
      { id: "070", name: "Huyện Sóc Sơn" },
      { id: "071", name: "Huyện Đông Anh" },
      { id: "072", name: "Huyện Gia Lâm" },
      { id: "073", name: "Huyện Thanh Trì" },
      { id: "074", name: "Quận Tây Hồ" },
      { id: "075", name: "Quận Ba Đình" },
      { id: "076", name: "Quận Hoàn Kiếm" },
      { id: "077", name: "Quận Hai Bà Trưng" },
      { id: "078", name: "Quận Đống Đa" },
      { id: "079", name: "Quận Thanh Xuân" }
    ]
  },
  {
    id: "79",
    name: "Hồ Chí Minh",
    districts: [
      { id: "760", name: "Quận 1" },
      { id: "761", name: "Quận 12" },
      { id: "762", name: "Quận Thủ Đức" },
      { id: "763", name: "Quận 9" },
      { id: "764", name: "Quận Gò Vấp" },
      { id: "765", name: "Quận Bình Thạnh" },
      { id: "766", name: "Quận Tân Bình" },
      { id: "767", name: "Quận Tân Phú" },
      { id: "768", name: "Quận Phú Nhuận" },
      { id: "769", name: "Quận 2" },
      { id: "770", name: "Quận 3" },
      { id: "771", name: "Quận 10" },
      { id: "772", name: "Quận 11" },
      { id: "773", name: "Quận 4" },
      { id: "774", name: "Quận 5" },
      { id: "775", name: "Quận 6" },
      { id: "776", name: "Quận 8" },
      { id: "777", name: "Quận Bình Tân" },
      { id: "778", name: "Huyện Củ Chi" },
      { id: "779", name: "Huyện Hóc Môn" },
      { id: "780", name: "Huyện Bình Chánh" },
      { id: "781", name: "Huyện Nhà Bè" },
      { id: "782", name: "Huyện Cần Giờ" },
      { id: "783", name: "Thành phố Thủ Đức" }
    ]
  },
  {
    id: "48",
    name: "Đà Nẵng",
    districts: [
      { id: "490", name: "Quận Hải Châu" },
      { id: "491", name: "Quận Thanh Khê" },
      { id: "492", name: "Quận Sơn Trà" },
      { id: "493", name: "Quận Ngũ Hành Sơn" },
      { id: "494", name: "Quận Liên Chiểu" },
      { id: "495", name: "Quận Cẩm Lệ" },
      { id: "497", name: "Huyện Hòa Vang" },
      { id: "498", name: "Huyện Hoàng Sa" }
    ]
  },
  {
    id: "02",
    name: "Hà Giang",
    districts: [
      { id: "040", name: "Thành phố Hà Giang" },
      { id: "042", name: "Huyện Đồng Văn" },
      { id: "043", name: "Huyện Mèo Vạc" },
      { id: "044", name: "Huyện Yên Minh" },
      { id: "045", name: "Huyện Quản Bạ" },
      { id: "046", name: "Huyện Vị Xuyên" },
      { id: "047", name: "Huyện Bắc Mê" },
      { id: "048", name: "Huyện Quang Bình" },
      { id: "049", name: "Huyện Hoàng Su Phì" },
      { id: "050", name: "Huyện Xín Mần" },
      { id: "051", name: "Huyện Bắc Quang" },
      { id: "052", name: "Huyện Quế Võ" },
      { id: "053", name: "Huyện Vị Xuyên" }
    ]
  },
  {
    id: "04",
    name: "Cao Bằng",
    districts: [
      { id: "060", name: "Thành phố Cao Bằng" },
      { id: "062", name: "Huyện Bảo Lạc" },
      { id: "063", name: "Huyện Thông Nông" },
      { id: "064", name: "Huyện Hà Quảng" },
      { id: "065", name: "Huyện Trà Lĩnh" },
      { id: "066", name: "Huyện Trùng Khánh" },
      { id: "067", name: "Huyện Hạ Lang" },
      { id: "068", name: "Huyện Quảng Uyên" },
      { id: "069", name: "Huyện Phục Hoà" },
      { id: "070", name: "Huyện Hoà An" },
      { id: "071", name: "Huyện Nguyên Bình" },
      { id: "072", name: "Huyện Thạch An" },
      { id: "073", name: "Huyện Quảng Hòa" }
    ]
  },
  {
    id: "06",
    name: "Bắc Kạn",
    districts: [
      { id: "080", name: "Thành phố Bắc Kạn" },
      { id: "082", name: "Huyện Pác Nặm" },
      { id: "083", name: "Huyện Ba Bể" },
      { id: "084", name: "Huyện Ngân Sơn" },
      { id: "085", name: "Huyện Bạch Thông" },
      { id: "086", name: "Huyện Chợ Đồn" },
      { id: "087", name: "Huyện Chợ Mới" },
      { id: "088", name: "Huyện Na Rì" }
    ]
  },
  {
    id: "08",
    name: "Tuyên Quang",
    districts: [
      { id: "100", name: "Thành phố Tuyên Quang" },
      { id: "102", name: "Huyện Lâm Bình" },
      { id: "103", name: "Huyện Nà Hang" },
      { id: "104", name: "Huyện Chiêm Hóa" },
      { id: "105", name: "Huyện Hàm Yên" },
      { id: "106", name: "Huyện Yên Sơn" },
      { id: "107", name: "Huyện Sơn Dương" }
    ]
  },
  {
    id: "10",
    name: "Lào Cai",
    districts: [
      { id: "120", name: "Thành phố Lào Cai" },
      { id: "122", name: "Huyện Bát Xát" },
      { id: "123", name: "Huyện Mường Khương" },
      { id: "124", name: "Huyện Si Ma Cai" },
      { id: "125", name: "Huyện Bắc Hà" },
      { id: "126", name: "Huyện Bảo Thắng" },
      { id: "127", name: "Huyện Bảo Yên" },
      { id: "128", name: "Huyện Sa Pa" },
      { id: "129", name: "Huyện Văn Bàn" }
    ]
  },
  {
    id: "11",
    name: "Điện Biên",
    districts: [
      { id: "130", name: "Thành phố Điện Biên Phủ" },
      { id: "131", name: "Thị xã Mường Lay" },
      { id: "132", name: "Huyện Mường Nhé" },
      { id: "133", name: "Huyện Mường Chà" },
      { id: "134", name: "Huyện Tủa Chùa" },
      { id: "135", name: "Huyện Tuần Giáo" },
      { id: "136", name: "Huyện Điện Biên" },
      { id: "137", name: "Huyện Điện Biên Đông" },
      { id: "138", name: "Huyện Mường Ảng" },
      { id: "139", name: "Huyện Nậm Pồ" }
    ]
  },
  {
    id: "12",
    name: "Lai Châu",
    districts: [
      { id: "140", name: "Thành phố Lai Châu" },
      { id: "141", name: "Huyện Tam Đường" },
      { id: "142", name: "Huyện Mường Tè" },
      { id: "143", name: "Huyện Sìn Hồ" },
      { id: "144", name: "Huyện Phong Thổ" },
      { id: "145", name: "Huyện Than Uyên" },
      { id: "146", name: "Huyện Tân Uyên" },
      { id: "147", name: "Huyện Nậm Nhùn" },
      { id: "148", name: "Huyện Than Uyên" }
    ]
  },
  {
    id: "14",
    name: "Sơn La",
    districts: [
      { id: "150", name: "Thành phố Sơn La" },
      { id: "152", name: "Huyện Quỳnh Nhai" },
      { id: "153", name: "Huyện Thuận Châu" },
      { id: "154", name: "Huyện Mường La" },
      { id: "155", name: "Huyện Bắc Yên" },
      { id: "156", name: "Huyện Phù Yên" },
      { id: "157", name: "Huyện Mộc Châu" },
      { id: "158", name: "Huyện Yên Châu" },
      { id: "159", name: "Huyện Mai Sơn" },
      { id: "160", name: "Huyện Sông Mã" },
      { id: "161", name: "Huyện Sốp Cộp" },
      { id: "162", name: "Huyện Vân Hồ" }
    ]
  },
  {
    id: "15",
    name: "Yên Bái",
    districts: [
      { id: "170", name: "Thành phố Yên Bái" },
      { id: "172", name: "Thị xã Nghĩa Lộ" },
      { id: "173", name: "Huyện Lục Yên" },
      { id: "174", name: "Huyện Văn Yên" },
      { id: "175", name: "Huyện Mù Căng Chải" },
      { id: "176", name: "Huyện Trấn Yên" },
      { id: "177", name: "Huyện Trạm Tấu" },
      { id: "178", name: "Huyện Văn Chấn" },
      { id: "179", name: "Huyện Yên Bình" }
    ]
  },
  {
    id: "17",
    name: "Hòa Bình",
    districts: [
      { id: "190", name: "Thành phố Hòa Bình" },
      { id: "192", name: "Huyện Đà Bắc" },
      { id: "193", name: "Huyện Kỳ Sơn" },
      { id: "194", name: "Huyện Lương Sơn" },
      { id: "195", name: "Huyện Kim Bôi" },
      { id: "196", name: "Huyện Cao Phong" },
      { id: "197", name: "Huyện Tân Lạc" },
      { id: "198", name: "Huyện Mai Châu" },
      { id: "199", name: "Huyện Lạc Sơn" },
      { id: "200", name: "Huyện Yên Thủy" },
      { id: "201", name: "Huyện Lạc Thủy" }
    ]
  },
  {
    id: "19",
    name: "Thái Nguyên",
    districts: [
      { id: "205", name: "Thành phố Thái Nguyên" },
      { id: "206", name: "Thành phố Sông Công" },
      { id: "207", name: "Huyện Định Hóa" },
      { id: "208", name: "Huyện Phú Lương" },
      { id: "209", name: "Huyện Đồng Hỷ" },
      { id: "210", name: "Huyện Võ Nhai" },
      { id: "211", name: "Huyện Đại Từ" },
      { id: "213", name: "Thị xã Phổ Yên" },
      { id: "215", name: "Huyện Phú Bình" }
    ]
  },
  {
    id: "20",
    name: "Lạng Sơn",
    districts: [
      { id: "220", name: "Thành phố Lạng Sơn" },
      { id: "221", name: "Huyện Tràng Định" },
      { id: "222", name: "Huyện Bình Gia" },
      { id: "223", name: "Huyện Văn Lãng" },
      { id: "224", name: "Huyện Cao Lộc" },
      { id: "225", name: "Huyện Văn Quan" },
      { id: "226", name: "Huyện Bắc Sơn" },
      { id: "227", name: "Huyện Hữu Lũng" },
      { id: "228", name: "Huyện Chi Lăng" },
      { id: "229", name: "Huyện Lộc Bình" },
      { id: "230", name: "Huyện Đình Lập" }
    ]
  },
  {
    id: "22",
    name: "Quảng Ninh",
    districts: [
      { id: "240", name: "Thành phố Hạ Long" },
      { id: "241", name: "Thành phố Móng Cái" },
      { id: "242", name: "Thành phố Cẩm Phả" },
      { id: "243", name: "Thành phố Uông Bí" },
      { id: "244", name: "Huyện Bình Liêu" },
      { id: "245", name: "Huyện Tiên Yên" },
      { id: "246", name: "Huyện Đầm Hà" },
      { id: "247", name: "Huyện Hải Hà" },
      { id: "248", name: "Huyện Ba Chẽ" },
      { id: "249", name: "Huyện Vân Đồn" },
      { id: "250", name: "Huyện Hoành Bồ" },
      { id: "251", name: "Thị xã Đông Triều" },
      { id: "252", name: "Thị xã Quảng Yên" },
      { id: "253", name: "Huyện Cô Tô" }
    ]
  },
  {
    id: "24",
    name: "Bắc Giang",
    districts: [
      { id: "260", name: "Thành phố Bắc Giang" },
      { id: "261", name: "Huyện Yên Thế" },
      { id: "262", name: "Huyện Tân Yên" },
      { id: "263", name: "Huyện Lạng Giang" },
      { id: "264", name: "Huyện Lục Nam" },
      { id: "265", name: "Huyện Lục Ngạn" },
      { id: "266", name: "Huyện Sơn Động" },
      { id: "267", name: "Huyện Yên Dũng" },
      { id: "268", name: "Huyện Việt Yên" },
      { id: "269", name: "Huyện Hiệp Hòa" }
    ]
  },
  {
    id: "25",
    name: "Phú Thọ",
    districts: [
      { id: "270", name: "Thành phố Việt Trì" },
      { id: "271", name: "Thị xã Phú Thọ" },
      { id: "272", name: "Huyện Đoan Hùng" },
      { id: "273", name: "Huyện Hạ Hoà" },
      { id: "274", name: "Huyện Thanh Ba" },
      { id: "275", name: "Huyện Phù Ninh" },
      { id: "276", name: "Huyện Yên Lập" },
      { id: "277", name: "Huyện Cẩm Khê" },
      { id: "278", name: "Huyện Tam Nông" },
      { id: "279", name: "Huyện Lâm Thao" },
      { id: "280", name: "Huyện Thanh Sơn" },
      { id: "281", name: "Huyện Thanh Thuỷ" },
      { id: "282", name: "Huyện Tân Sơn" }
    ]
  },
  {
    id: "26",
    name: "Vĩnh Phúc",
    districts: [
      { id: "288", name: "Thành phố Vĩnh Yên" },
      { id: "289", name: "Thị xã Phúc Yên" },
      { id: "290", name: "Huyện Lập Thạch" },
      { id: "291", name: "Huyện Tam Dương" },
      { id: "292", name: "Huyện Tam Đảo" },
      { id: "293", name: "Huyện Bình Xuyên" },
      { id: "294", name: "Huyện Mê Linh" },
      { id: "295", name: "Huyện Yên Lạc" },
      { id: "296", name: "Huyện Vĩnh Tường" },
      { id: "297", name: "Huyện Sông Lô" }
    ]
  },
  {
    id: "27",
    name: "Bắc Ninh",
    districts: [
      { id: "300", name: "Thành phố Bắc Ninh" },
      { id: "301", name: "Huyện Yên Phong" },
      { id: "302", name: "Huyện Quế Võ" },
      { id: "303", name: "Huyện Tiên Du" },
      { id: "304", name: "Thị xã Từ Sơn" },
      { id: "305", name: "Huyện Thuận Thành" },
      { id: "306", name: "Huyện Gia Bình" },
      { id: "307", name: "Huyện Lương Tài" },
      { id: "308", name: "Thị xã Thuận Thành" }
    ]
  },
  {
    id: "30",
    name: "Hải Dương",
    districts: [
      { id: "315", name: "Thành phố Hải Dương" },
      { id: "317", name: "Thị xã Chí Linh" },
      { id: "323", name: "Huyện Nam Sách" },
      { id: "325", name: "Huyện Kinh Môn" },
      { id: "327", name: "Huyện Kim Thành" },
      { id: "329", name: "Huyện Thanh Hà" },
      { id: "331", name: "Huyện Cẩm Giàng" },
      { id: "333", name: "Huyện Bình Giang" },
      { id: "335", name: "Huyện Gia Lộc" },
      { id: "337", name: "Huyện Tứ Kỳ" },
      { id: "339", name: "Huyện Ninh Giang" },
      { id: "341", name: "Huyện Thanh Miện" }
    ]
  },
  {
    id: "31",
    name: "Hải Phòng",
    districts: [
      { id: "325", name: "Quận Hồng Bàng" },
      { id: "326", name: "Quận Ngô Quyền" },
      { id: "327", name: "Quận Lê Chân" },
      { id: "328", name: "Quận Hải An" },
      { id: "329", name: "Quận Kiến An" },
      { id: "330", name: "Quận Đồ Sơn" },
      { id: "331", name: "Quận Dương Kinh" },
      { id: "336", name: "Huyện Thuỷ Nguyên" },
      { id: "337", name: "Huyện An Dương" },
      { id: "338", name: "Huyện An Lão" },
      { id: "339", name: "Huyện Kiến Thuỵ" },
      { id: "340", name: "Huyện Tiên Lãng" },
      { id: "341", name: "Huyện Vĩnh Bảo" },
      { id: "342", name: "Huyện Cát Hải" },
      { id: "343", name: "Huyện Bạch Long Vĩ" },
      { id: "344", name: "Huyện Duyên Hải" },
      { id: "345", name: "Quận Hải An" },
      { id: "346", name: "Quận Ngô Quyền" }
    ]
  },
  {
    id: "33",
    name: "Hưng Yên",
    districts: [
      { id: "356", name: "Thành phố Hưng Yên" },
      { id: "358", name: "Huyện Văn Lâm" },
      { id: "359", name: "Huyện Văn Giang" },
      { id: "360", name: "Huyện Yên Mỹ" },
      { id: "361", name: "Thị xã Mỹ Hào" },
      { id: "362", name: "Huyện Ân Thi" },
      { id: "363", name: "Huyện Khoái Châu" },
      { id: "364", name: "Huyện Kim Động" },
      { id: "365", name: "Huyện Tiên Lữ" },
      { id: "366", name: "Huyện Phù Cừ" }
    ]
  },
  {
    id: "34",
    name: "Thái Bình",
    districts: [
      { id: "370", name: "Thành phố Thái Bình" },
      { id: "372", name: "Huyện Quỳnh Phụ" },
      { id: "373", name: "Huyện Hưng Hà" },
      { id: "374", name: "Huyện Đông Hưng" },
      { id: "375", name: "Huyện Thái Thụy" },
      { id: "376", name: "Huyện Tiền Hải" },
      { id: "377", name: "Huyện Kiến Xương" },
      { id: "378", name: "Huyện Vũ Thư" }
    ]
  },
  {
    id: "35",
    name: "Hà Nam",
    districts: [
      { id: "380", name: "Thành phố Phủ Lý" },
      { id: "382", name: "Huyện Duy Tiên" },
      { id: "383", name: "Huyện Kim Bảng" },
      { id: "384", name: "Huyện Thanh Liêm" },
      { id: "385", name: "Huyện Bình Lục" },
      { id: "386", name: "Huyện Lý Nhân" }
    ]
  },
  {
    id: "36",
    name: "Nam Định",
    districts: [
      { id: "390", name: "Thành phố Nam Định" },
      { id: "392", name: "Huyện Mỹ Lộc" },
      { id: "393", name: "Huyện Vụ Bản" },
      { id: "394", name: "Huyện Ý Yên" },
      { id: "395", name: "Huyện Nghĩa Hưng" },
      { id: "396", name: "Huyện Nam Trực" },
      { id: "397", name: "Huyện Trực Ninh" },
      { id: "398", name: "Huyện Xuân Trường" },
      { id: "399", name: "Huyện Giao Thủy" },
      { id: "400", name: "Huyện Hải Hậu" }
    ]
  },
  {
    id: "37",
    name: "Ninh Bình",
    districts: [
      { id: "405", name: "Thành phố Ninh Bình" },
      { id: "406", name: "Thành phố Tam Điệp" },
      { id: "407", name: "Huyện Nho Quan" },
      { id: "408", name: "Huyện Gia Viễn" },
      { id: "409", name: "Huyện Hoa Lư" },
      { id: "410", name: "Huyện Yên Khánh" },
      { id: "411", name: "Huyện Kim Sơn" },
      { id: "412", name: "Huyện Yên Mô" }
    ]
  },
  {
    id: "38",
    name: "Thanh Hóa",
    districts: [
      { id: "412", name: "Thành phố Thanh Hóa" },
      { id: "413", name: "Thị xã Bỉm Sơn" },
      { id: "414", name: "Thành phố Sầm Sơn" },
      { id: "422", name: "Huyện Mường Lát" },
      { id: "423", name: "Huyện Quan Hóa" },
      { id: "424", name: "Huyện Bá Thước" },
      { id: "425", name: "Huyện Quan Sơn" },
      { id: "426", name: "Huyện Lang Chánh" },
      { id: "427", name: "Huyện Ngọc Lặc" },
      { id: "428", name: "Huyện Cẩm Thủy" },
      { id: "429", name: "Huyện Thạch Thành" },
      { id: "430", name: "Huyện Hà Trung" },
      { id: "431", name: "Huyện Vĩnh Lộc" },
      { id: "432", name: "Huyện Yên Định" },
      { id: "433", name: "Huyện Thọ Xuân" },
      { id: "434", name: "Huyện Thường Xuân" },
      { id: "435", name: "Huyện Triệu Sơn" },
      { id: "436", name: "Huyện Thiệu Hóa" },
      { id: "437", name: "Huyện Hoằng Hóa" },
      { id: "438", name: "Huyện Hậu Lộc" },
      { id: "439", name: "Huyện Nga Sơn" },
      { id: "440", name: "Huyện Như Xuân" },
      { id: "441", name: "Huyện Như Thanh" },
      { id: "442", name: "Huyện Nông Cống" },
      { id: "443", name: "Huyện Đông Sơn" },
      { id: "444", name: "Huyện Quảng Xương" },
      { id: "445", name: "Huyện Tĩnh Gia" }
    ]
  },
  {
    id: "40",
    name: "Nghệ An",
    districts: [
      { id: "450", name: "Thành phố Vinh" },
      { id: "451", name: "Thị xã Cửa Lò" },
      { id: "452", name: "Thị xã Thái Hoà" },
      { id: "453", name: "Huyện Quế Phong" },
      { id: "454", name: "Huyện Quỳ Châu" },
      { id: "455", name: "Huyện Kỳ Sơn" },
      { id: "456", name: "Huyện Tương Dương" },
      { id: "457", name: "Huyện Con Cuông" },
      { id: "458", name: "Huyện Tân Kỳ" },
      { id: "459", name: "Huyện Anh Sơn" },
      { id: "460", name: "Huyện Diễn Châu" },
      { id: "461", name: "Huyện Yên Thành" },
      { id: "462", name: "Huyện Đô Lương" },
      { id: "463", name: "Huyện Thanh Chương" },
      { id: "464", name: "Huyện Nghi Lộc" },
      { id: "465", name: "Huyện Nam Đàn" },
      { id: "466", name: "Huyện Hưng Nguyên" },
      { id: "467", name: "Thị xã Hoàng Mai" },
      { id: "468", name: "Huyện Quỳ Hợp" },
      { id: "469", name: "Huyện Quỳnh Lưu" },
      { id: "470", name: "Huyện Khai Sơn" },
      { id: "471", name: "Huyện Con Cuông" }
    ]
  },
  {
    id: "42",
    name: "Hà Tĩnh",
    districts: [
      { id: "474", name: "Thành phố Hà Tĩnh" },
      { id: "475", name: "Thị xã Hồng Lĩnh" },
      { id: "476", name: "Huyện Hương Sơn" },
      { id: "477", name: "Huyện Đức Thọ" },
      { id: "478", name: "Huyện Vũ Quang" },
      { id: "479", name: "Huyện Nghi Xuân" },
      { id: "480", name: "Huyện Can Lộc" },
      { id: "481", name: "Huyện Hương Khê" },
      { id: "482", name: "Huyện Thạch Hà" },
      { id: "483", name: "Huyện Cẩm Xuyên" },
      { id: "484", name: "Huyện Kỳ Anh" },
      { id: "485", name: "Huyện Lộc Hà" },
      { id: "486", name: "Thị xã Kỳ Anh" },
      { id: "487", name: "Huyện Thạch Hà" },
      { id: "488", name: "Huyện Cẩm Xuyên" }
    ]
  },
  {
    id: "44",
    name: "Quảng Bình",
    districts: [
      { id: "490", name: "Thành phố Đồng Hới" },
      { id: "491", name: "Huyện Minh Hóa" },
      { id: "492", name: "Huyện Tuyên Hóa" },
      { id: "493", name: "Huyện Quảng Trạch" },
      { id: "494", name: "Huyện Bố Trạch" },
      { id: "495", name: "Huyện Quảng Ninh" },
      { id: "496", name: "Huyện Lệ Thủy" },
      { id: "497", name: "Thị xã Ba Đồn" }
    ]
  },
  {
    id: "45",
    name: "Quảng Trị",
    districts: [
      { id: "502", name: "Thành phố Đông Hà" },
      { id: "503", name: "Thị xã Quảng Trị" },
      { id: "504", name: "Huyện Vĩnh Linh" },
      { id: "505", name: "Huyện Hướng Hóa" },
      { id: "506", name: "Huyện Gio Linh" },
      { id: "507", name: "Huyện Đa Krông" },
      { id: "508", name: "Huyện Cam Lộ" },
      { id: "509", name: "Huyện Triệu Phong" },
      { id: "510", name: "Huyện Hải Lăng" },
      { id: "511", name: "Huyện Cồn Cỏ" }
    ]
  },
  {
    id: "46",
    name: "Thừa Thiên Huế",
    districts: [
      { id: "513", name: "Thành phố Huế" },
      { id: "514", name: "Huyện Phong Điền" },
      { id: "515", name: "Huyện Quảng Điền" },
      { id: "516", name: "Huyện Phú Vang" },
      { id: "517", name: "Thị xã Hương Thủy" },
      { id: "518", name: "Thị xã Hương Trà" },
      { id: "519", name: "Huyện A Lưới" },
      { id: "520", name: "Huyện Phú Lộc" },
      { id: "521", name: "Huyện Nam Đông" },
      { id: "522", name: "Thành phố Bắc Hương" }
    ]
  },
  {
    id: "48",
    name: "Đà Nẵng",
    districts: [
      { id: "523", name: "Quận Hải Châu" },
      { id: "524", name: "Quận Thanh Khê" },
      { id: "525", name: "Quận Sơn Trà" },
      { id: "526", name: "Quận Ngũ Hành Sơn" },
      { id: "527", name: "Quận Liên Chiểu" },
      { id: "528", name: "Quận Cẩm Lệ" },
      { id: "529", name: "Huyện Hòa Vang" },
      { id: "530", name: "Huyện Hoàng Sa" }
    ]
  },
  {
    id: "49",
    name: "Quảng Nam",
    districts: [
      { id: "530", name: "Thành phố Tam Kỳ" },
      { id: "531", name: "Thành phố Hội An" },
      { id: "532", name: "Huyện Tây Giang" },
      { id: "533", name: "Huyện Đông Giang" },
      { id: "534", name: "Huyện Đại Lộc" },
      { id: "535", name: "Thị xã Điện Bàn" },
      { id: "536", name: "Huyện Duy Xuyên" },
      { id: "537", name: "Huyện Quế Sơn" },
      { id: "538", name: "Huyện Nam Giang" },
      { id: "539", name: "Huyện Phước Sơn" },
      { id: "540", name: "Huyện Hiệp Đức" },
      { id: "541", name: "Huyện Thăng Bình" },
      { id: "542", name: "Huyện Tiên Phước" },
      { id: "543", name: "Huyện Bắc Trà My" },
      { id: "544", name: "Huyện Nam Trà My" },
      { id: "545", name: "Huyện Núi Thành" },
      { id: "546", name: "Huyện Phú Ninh" },
      { id: "547", name: "Huyện Nông Sơn" },
      { id: "548", name: "Huyện Trà Bồng" }
    ]
  },
  {
    id: "51",
    name: "Kon Tum",
    districts: [
      { id: "561", name: "Thành phố Kon Tum" },
      { id: "562", name: "Huyện Đắk Glei" },
      { id: "563", name: "Huyện Ngọc Hồi" },
      { id: "564", name: "Huyện Đắk Tô" },
      { id: "565", name: "Huyện Kon Plông" },
      { id: "566", name: "Huyện Kon Rẫy" },
      { id: "567", name: "Huyện Đắk Hà" },
      { id: "568", name: "Huyện Sa Thầy" },
      { id: "569", name: "Huyện Tu Mơ Rông" },
      { id: "570", name: "Huyện Ia H' Drai" }
    ]
  },
  {
    id: "52",
    name: "Quảng Ngãi",
    districts: [
      { id: "572", name: "Thành phố Quảng Ngãi" },
      { id: "573", name: "Huyện Bình Sơn" },
      { id: "574", name: "Huyện Trà Bồng" },
      { id: "575", name: "Huyện Tây Trà" },
      { id: "576", name: "Huyện Sơn Tịnh" },
      { id: "577", name: "Huyện Tư Nghĩa" },
      { id: "578", name: "Huyện Sơn Hà" },
      { id: "579", name: "Huyện Hà Mai" },
      { id: "580", name: "Huyện Nghĩa Hành" },
      { id: "581", name: "Huyện Mộ Đức" },
      { id: "582", name: "Huyện Đức Phổ" },
      { id: "583", name: "Huyện Ba Tơ" },
      { id: "584", name: "Huyện Lý Sơn" }
    ]
  },
  {
    id: "54",
    name: "Gia Lai",
    districts: [
      { id: "588", name: "Thành phố Pleiku" },
      { id: "589", name: "Thị xã An Khê" },
      { id: "590", name: "Thị xã Ayun Pa" },
      { id: "591", name: "Huyện KBang" },
      { id: "592", name: "Huyện Đăk Đoa" },
      { id: "593", name: "Huyện Chư Păh" },
      { id: "594", name: "Huyện Ia Grai" },
      { id: "595", name: "Huyện Mang Yang" },
      { id: "596", name: "Huyện Kông Chro" },
      { id: "597", name: "Huyện Đức Cơ" },
      { id: "598", name: "Huyện Chư Prông" },
      { id: "599", name: "Huyện Chư Sê" },
      { id: "600", name: "Huyện Đăk Pơ" },
      { id: "601", name: "Huyện Ia Pa" },
      { id: "602", name: "Huyện Krông Pa" },
      { id: "603", name: "Huyện Phú Thiện" },
      { id: "604", name: "Huyện Chư Pưh" }
    ]
  },
  {
    id: "56",
    name: "Bình Định",
    districts: [
      { id: "608", name: "Thành phố Quy Nhơn" },
      { id: "610", name: "Huyện An Lão" },
      { id: "611", name: "Thị xã Hoài Nhơn" },
      { id: "612", name: "Huyện Hoài Ân" },
      { id: "613", name: "Huyện Phù Mỹ" },
      { id: "614", name: "Huyện Vĩnh Thạnh" },
      { id: "615", name: "Huyện Tây Sơn" },
      { id: "616", name: "Huyện Phù Cát" },
      { id: "617", name: "Thị xã An Nhơn" },
      { id: "618", name: "Huyện Tuy Phước" },
      { id: "619", name: "Huyện Vân Canh" }
    ]
  },
  {
    id: "58",
    name: "Đắk Lắk",
    districts: [
      { id: "622", name: "Thành phố Buôn Ma Thuột" },
      { id: "623", name: "Thị xã Buôn Hồ" },
      { id: "624", name: "Huyện Ea H'leo" },
      { id: "625", name: "Huyện Ea Súp" },
      { id: "626", name: "Huyện Buôn Đôn" },
      { id: "627", name: "Huyện Cư M'gar" },
      { id: "628", name: "Huyện Krông Búk" },
      { id: "629", name: "Huyện Krông Năng" },
      { id: "630", name: "Huyện Ea Kar" },
      { id: "631", name: "Huyện M'Đrắk" },
      { id: "632", name: "Huyện Krông Bông" },
      { id: "633", name: "Huyện Krông Pắc" },
      { id: "634", name: "Huyện Krông A Na" },
      { id: "635", name: "Huyện Lắk" },
      { id: "636", name: "Huyện Cư Kuin" }
    ]
  },
  {
    id: "60",
    name: "Đắk Nông",
    districts: [
      { id: "643", name: "Thị xã Gia Nghĩa" },
      { id: "644", name: "Huyện Đăk Glong" },
      { id: "645", name: "Huyện Cư Jút" },
      { id: "646", name: "Huyện Đắk Mil" },
      { id: "647", name: "Huyện Krông Nô" },
      { id: "648", name: "Huyện Đắk Song" },
      { id: "649", name: "Huyện Đắk R'Lấp" },
      { id: "650", name: "Huyện Tuy Đức" }
    ]
  },
  {
    id: "62",
    name: "Lâm Đồng",
    districts: [
      { id: "654", name: "Thành phố Đà Lạt" },
      { id: "655", name: "Thành phố Bảo Lộc" },
      { id: "656", name: "Huyện Đam Rông" },
      { id: "657", name: "Huyện Lạc Dương" },
      { id: "658", name: "Huyện Lâm Hà" },
      { id: "659", name: "Huyện Đơn Dương" },
      { id: "660", name: "Huyện Đức Trọng" },
      { id: "661", name: "Huyện Di Linh" },
      { id: "662", name: "Huyện Bảo Lâm" },
      { id: "663", name: "Huyện Cát Tiên" }
    ]
  },
  {
    id: "64",
    name: "Bình Phước",
    districts: [
      { id: "672", name: "Thị xã Phước Long" },
      { id: "673", name: "Thành phố Đồng Xoài" },
      { id: "674", name: "Thị xã Bình Long" },
      { id: "675", name: "Huyện Bù Gia Mập" },
      { id: "676", name: "Huyện Lộc Ninh" },
      { id: "677", name: "Huyện Bù Đốp" },
      { id: "678", name: "Huyện Hớn Quản" },
      { id: "679", name: "Huyện Đồng Phú" },
      { id: "680", name: "Huyện Bù Đăng" },
      { id: "681", name: "Huyện Chơn Thành" },
      { id: "682", name: "Huyện Phú Riềng" }
    ]
  },
  {
    id: "66",
    name: "Tây Ninh",
    districts: [
      { id: "688", name: "Thành phố Tây Ninh" },
      { id: "689", name: "Huyện Tân Biên" },
      { id: "690", name: "Huyện Tân Châu" },
      { id: "691", name: "Huyện Dương Minh Châu" },
      { id: "692", name: "Huyện Châu Thành" },
      { id: "693", name: "Thị xã Hòa Thành" },
      { id: "694", name: "Huyện Gò Dầu" },
      { id: "695", name: "Huyện Bến Cầu" },
      { id: "696", name: "Thị xã Trảng Bàng" }
    ]
  },
  {
    id: "67",
    name: "Bình Dương",
    districts: [
      { id: "698", name: "Thành phố Thủ Dầu Một" },
      { id: "703", name: "Huyện Bàu Bàng" },
      { id: "704", name: "Huyện Dầu Tiếng" },
      { id: "705", name: "Thị xã Bến Cát" },
      { id: "706", name: "Thành phố Tân Uyên" },
      { id: "707", name: "Thành phố Dĩ An" },
      { id: "708", name: "Thành phố Thuận An" },
      { id: "709", name: "Huyện Phú Giáo" },
      { id: "710", name: "Thị xã Tân Phước Khánh" }
    ]
  },
  {
    id: "68",
    name: "Đồng Nai",
    districts: [
      { id: "716", name: "Thành phố Biên Hòa" },
      { id: "717", name: "Thị xã Long Khánh" },
      { id: "718", name: "Huyện Tân Phú" },
      { id: "719", name: "Huyện Vĩnh Cửu" },
      { id: "720", name: "Huyện Định Quán" },
      { id: "721", name: "Huyện Trảng Bom" },
      { id: "722", name: "Huyện Thống Nhất" },
      { id: "723", name: "Huyện Cẩm Mỹ" },
      { id: "724", name: "Huyện Long Thành" },
      { id: "725", name: "Huyện Xuân Lộc" },
      { id: "726", name: "Huyện Nhơn Trạch" }
    ]
  },
  {
    id: "70",
    name: "Bà Rịa - Vũng Tàu",
    districts: [
      { id: "732", name: "Thành phố Vũng Tàu" },
      { id: "733", name: "Thành phố Bà Rịa" },
      { id: "734", name: "Huyện Châu Đức" },
      { id: "735", name: "Huyện Xuyên Mộc" },
      { id: "736", name: "Huyện Long Điền" },
      { id: "737", name: "Huyện Đất Đỏ" },
      { id: "738", name: "Thị xã Phú Mỹ" },
      { id: "739", name: "Huyện Côn Đảo" }
    ]
  },
  {
    id: "72",
    name: "Long An",
    districts: [
      { id: "750", name: "Thành phố Tân An" },
      { id: "751", name: "Thị xã Kiến Tường" },
      { id: "752", name: "Huyện Tân Hưng" },
      { id: "753", name: "Huyện Vĩnh Hưng" },
      { id: "754", name: "Huyện Mộc Hóa" },
      { id: "755", name: "Huyện Bến Lức" },
      { id: "756", name: "Huyện Thủ Thừa" },
      { id: "757", name: "Huyện Tân Trụ" },
      { id: "758", name: "Huyện Cần Đước" },
      { id: "759", name: "Huyện Cần Giuộc" },
      { id: "760", name: "Huyện Châu Thành" },
      { id: "761", name: "Huyện Đức Huệ" },
      { id: "762", name: "Huyện Đức Hòa" },
      { id: "763", name: "Huyện Bến Lức" },
      { id: "764", name: "Huyện Thạnh Hóa" },
      { id: "765", name: "Huyện Hiệp Hòa" }
    ]
  },
  {
    id: "74",
    name: "Tiền Giang",
    districts: [
      { id: "765", name: "Thành phố Mỹ Tho" },
      { id: "766", name: "Thị xã Gò Công" },
      { id: "767", name: "Thị xã Cai Lậy" },
      { id: "768", name: "Huyện Tân Phước" },
      { id: "769", name: "Huyện Cái Bè" },
      { id: "770", name: "Huyện Cai Lậy" },
      { id: "771", name: "Huyện Châu Thành" },
      { id: "772", name: "Huyện Chợ Gạo" },
      { id: "773", name: "Huyện Gò Công Tây" },
      { id: "774", name: "Huyện Gò Công Đông" },
      { id: "775", name: "Huyện Tân Phú Đông" }
    ]
  },
  {
    id: "75",
    name: "Bến Tre",
    districts: [
      { id: "776", name: "Thành phố Bến Tre" },
      { id: "777", name: "Huyện Châu Thành" },
      { id: "778", name: "Huyện Chợ Lách" },
      { id: "779", name: "Huyện Mỏ Cày Nam" },
      { id: "780", name: "Huyện Giồng Trôm" },
      { id: "781", name: "Huyện Bình Đại" },
      { id: "782", name: "Huyện Ba Tri" },
      { id: "783", name: "Huyện Thạnh Phú" },
      { id: "784", name: "Huyện Mỏ Cày Bắc" }
    ]
  },
  {
    id: "77",
    name: "Vĩnh Long",
    districts: [
      { id: "783", name: "Thành phố Vĩnh Long" },
      { id: "784", name: "Huyện Long Hồ" },
      { id: "785", name: "Huyện Mang Thít" },
      { id: "786", name: "Huyện Ởm Tràm" },
      { id: "787", name: "Huyện Vũng Liêm" },
      { id: "788", name: "Huyện Tam Bình" },
      { id: "789", name: "Thị xã Bình Minh" },
      { id: "790", name: "Huyện Trà Ôn" },
      { id: "791", name: "Huyện Bình Tân" }
    ]
  },
  {
    id: "79",
    name: "Đồng Tháp",
    districts: [
      { id: "794", name: "Thành phố Cao Lãnh" },
      { id: "795", name: "Thành phố Sa Đéc" },
      { id: "796", name: "Thị xã Hồng Ngự" },
      { id: "797", name: "Huyện Tân Hồng" },
      { id: "798", name: "Huyện Hồng Ngự" },
      { id: "799", name: "Huyện Tam Nông" },
      { id: "800", name: "Huyện Tháp Mười" },
      { id: "801", name: "Huyện Cao Lãnh" },
      { id: "802", name: "Huyện Thanh Bình" },
      { id: "803", name: "Huyện Lấp Vò" },
      { id: "804", name: "Huyện Lai Vung" },
      { id: "805", name: "Huyện Châu Thành" }
    ]
  },
  {
    id: "80",
    name: "An Giang",
    districts: [
      { id: "807", name: "Thành phố Long Xuyên" },
      { id: "808", name: "Thành phố Châu Đốc" },
      { id: "809", name: "Huyện An Phú" },
      { id: "810", name: "Thị xã Tân Châu" },
      { id: "811", name: "Huyện Phú Tân" },
      { id: "812", name: "Huyện Châu Phú" },
      { id: "813", name: "Huyện Tịnh Biên" },
      { id: "814", name: "Huyện Tri Tôn" },
      { id: "815", name: "Huyện Châu Thành" },
      { id: "816", name: "Huyện Chợ Mới" },
      { id: "817", name: "Huyện Thoại Sơn" }
    ]
  },
  {
    id: "82",
    name: "Kiên Giang",
    districts: [
      { id: "824", name: "Thành phố Rạch Giá" },
      { id: "825", name: "Thị xã Hà Tiên" },
      { id: "826", name: "Huyện Kiên Lương" },
      { id: "827", name: "Huyện Hòn Đất" },
      { id: "828", name: "Huyện Tân Hiệp" },
      { id: "829", name: "Huyện Châu Thành" },
      { id: "830", name: "Huyện Giồng Riềng" },
      { id: "831", name: "Huyện Gò Quao" },
      { id: "832", name: "Huyện An Biên" },
      { id: "833", name: "Huyện An Minh" },
      { id: "834", name: "Huyện Vĩnh Thuận" },
      { id: "835", name: "Huyện Phú Quốc" },
      { id: "836", name: "Huyện Kiên Hải" },
      { id: "837", name: "Huyện U Minh Thượng" },
      { id: "838", name: "Huyện Giang Thành" },
      { id: "839", name: "Thành phố Phú Quốc" }
    ]
  },
  {
    id: "83",
    name: "Cần Thơ",
    districts: [
      { id: "842", name: "Quận Ninh Kiều" },
      { id: "843", name: "Quận Ô Môn" },
      { id: "844", name: "Quận Bình Thuỷ" },
      { id: "845", name: "Quận Cái Răng" },
      { id: "846", name: "Quận Thốt Nốt" },
      { id: "847", name: "Huyện Vĩnh Thạnh" },
      { id: "848", name: "Huyện Cờ Đỏ" },
      { id: "849", name: "Huyện Phong Điền" },
      { id: "850", name: "Huyện Thới Lai" },
      { id: "851", name: "Quận Bình Thuỷ" },
      { id: "852", name: "Quận Cái Răng" }
    ]
  },
  {
    id: "84",
    name: "Hậu Giang",
    districts: [
      { id: "855", name: "Thành phố Vị Thanh" },
      { id: "856", name: "Thị xã Ngã Bảy" },
      { id: "857", name: "Huyện Châu Thành A" },
      { id: "858", name: "Huyện Châu Thành" },
      { id: "859", name: "Huyện Phụng Hiệp" },
      { id: "860", name: "Huyện Vị Thuỷ" },
      { id: "861", name: "Huyện Long Mỹ" },
      { id: "862", name: "Thị xã Long Mỹ" }
    ]
  },
  {
    id: "86",
    name: "Sóc Trăng",
    districts: [
      { id: "866", name: "Thành phố Sóc Trăng" },
      { id: "867", name: "Huyện Châu Thành" },
      { id: "868", name: "Huyện Kế Sách" },
      { id: "869", name: "Huyện Mỹ Tú" },
      { id: "870", name: "Huyện Cù Lao Dung" },
      { id: "871", name: "Huyện Long Phú" },
      { id: "872", name: "Huyện Mỹ Xuyên" },
      { id: "873", name: "Thị xã Ngã Năm" },
      { id: "874", name: "Huyện Thạnh Trị" },
      { id: "875", name: "Thị xã Vĩnh Châu" },
      { id: "876", name: "Huyện Trần Đề" }
    ]
  },
  {
    id: "87",
    name: "Bạc Liêu",
    districts: [
      { id: "883", name: "Thành phố Bạc Liêu" },
      { id: "884", name: "Huyện Hồng Dân" },
      { id: "885", name: "Huyện Phước Long" },
      { id: "886", name: "Huyện Vĩnh Lợi" },
      { id: "887", name: "Thị xã Giá Rai" },
      { id: "888", name: "Huyện Đông Hải" },
      { id: "889", name: "Huyện Hoà Bình" }
    ]
  },
  {
    id: "89",
    name: "Cà Mau",
    districts: [
      { id: "899", name: "Thành phố Cà Mau" },
      { id: "900", name: "Huyện U Minh" },
      { id: "901", name: "Huyện Thới Bình" },
      { id: "902", name: "Huyện Trần Văn Thời" },
      { id: "903", name: "Huyện Cái Nước" },
      { id: "904", name: "Huyện Đầm Dơi" },
      { id: "905", name: "Huyện Năm Căn" },
      { id: "906", name: "Huyện Phú Tân" },
      { id: "907", name: "Huyện Ngọc Hiển" }
    ]
  }
];