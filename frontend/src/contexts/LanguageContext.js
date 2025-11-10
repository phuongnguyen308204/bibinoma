import React, { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext({
  lang: 'vi',
  setLang: () => {},
  t: (key) => key,
});

const DICT = {
  vi: {
    appName: 'Bibinoma',
    nav: {
      home: 'Trang chủ',
      pricing: 'Bảng giá',
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      planning: 'Lập kế hoạch',
      heartToHeart: 'Tâm sự'
    },
    navbar: {
      balance: 'Số dư: ',
      topUp: 'Nạp tiền',
      settings: 'Cài đặt',
      logout: 'Đăng xuất',
      currency: '₫',
    },
    wallet: {
      balance: 'Số dư',
      topUp: 'Nạp thêm',
      currency: '₫',
    },
    chat: {
      history: 'Lịch sử chat',
      welcome: 'Chào mừng bạn đến với Bibinoma, hãy để Bibi và Noma đồng hành cùng bạn',
      welcomeBack: 'Chào mừng trở lại!',
      selectAssistant: 'Chọn trợ lý AI',
      selectAssistantDescription: 'Bắt đầu cuộc trò chuyện với một trong hai trợ lý AI của chúng tôi',
      startChat: 'Bắt đầu chat',
      send: 'Gửi',
      sending: 'Đang gửi...',
      placeholder: 'Nhập tin nhắn...',
      needTopUp: 'Vui lòng nạp thêm tiền để sử dụng.',
      greeting: 'Xin chào 🙂 Bibinoma có thể giúp gì cho bạn?',
      planning: 'Noma',
      heartToHeart: 'Bibi',
      planningRole: 'Trợ lý lập kế hoạch',
      heartToHeartRole: 'Trợ lý tâm lý',
      chooseAssistantHelp: 'Chọn trợ lý phù hợp với nhu cầu của bạn',
      planningGreeting: "Hãy để Noma đồng hành cùng bạn, từng bước lên kế hoạch để vượt qua những nỗi buồn và tìm lại niềm vui trong cuộc sống.",
      heartToHeartGreeting: "Đừng ngại sẻ chia những ưu tư trong lòng, Bibi sẽ luôn ở đây lắng nghe và cùng bạn xoa dịu nỗi đau 💙",
      thinking: {
        bibi: 'Bibi đang suy nghĩ...',
        noma: 'Noma đang suy nghĩ...'
      },
      memories: {
        bibi: 'Trí nhớ của Bibi',
        noma: 'Kế hoạch của Noma',
        noMemories: 'Không có trí nhớ nào.',
        noPlans: 'Không có kế hoạch nào.'
      },
      demo: {
        planning: {
          bot: {
            greeting: 'Xin chào! Tôi là Noma, trợ lý lập kế hoạch của bạn. Hãy cho tôi biết bạn đang gặp khó khăn gì để tôi có thể giúp bạn lên kế hoạch vượt qua nhé! 💪',
            response: 'Tôi rất tiếc khi nghe về nỗi đau mà bạn đang trải qua. Mất mát tài chính như vậy có thể khiến bạn cảm thấy rất nặng nề, nhưng hãy nhớ rằng đây chỉ là một phần trong hành trình của bạn. Những khó khăn này sẽ giúp bạn trưởng thành và mạnh mẽ hơn trong tương lai.\n\nHiện tại là 13 giờ 18 phút chiều. Dưới đây là kế hoạch cho bạn từ giờ đến lúc ngủ (22:00):\n\n- 14:00: Nghỉ ngơi và thiền trong 15 phút để tái tạo năng lượng.\n- 15:00: Đọc một cuốn sách về khởi nghiệp hoặc phát triển bản thân.\n- 17:00: Viết nhật ký để ghi lại cảm xúc và suy nghĩ của bạn.\n- 19:00: Tập thể dục nhẹ nhàng như đi bộ hoặc yoga để giải tỏa căng thẳng.\n- 20:30: Chuẩn bị bữa tối và thưởng thức món ăn yêu thích.\n- 21:30: Xem một bộ phim hoặc chương trình giải trí để thư giãn.\n\nTạm thời hãy làm các việc đó và ngày mai báo cáo lại, tôi sẽ giúp bạn lập kế hoạch tiếp theo. Nếu kế hoạch chưa ổn, hãy ghi thêm thông tin để tôi tối ưu cho hôm nay nhé!',
            detailedResponse: 'Cảm ơn bạn đã cung cấp thông tin! Dưới đây là kế hoạch đã được tối ưu hóa cho ngày hôm nay, phù hợp với lịch trình của bạn:\n\n- 14:00: Nghỉ ngơi và thiền trong 15 phút để tái tạo năng lượng.\n- 15:00: Đi làm.\n- 18:00: Trở về nhà, dành thời gian thư giãn một chút.\n- 19:00: Tập thể dục nhẹ nhàng như đi bộ hoặc yoga để giải tỏa căng thẳng.\n- 20:30: Chuẩn bị bữa tối và thưởng thức món ăn yêu thích.\n- 21:30: Xem một bộ phim hoặc chương trình giải trí để thư giãn.\n\nTạm thời hãy làm các việc đó và ngày mai báo cáo lại, tôi sẽ giúp bạn lập kế hoạch tiếp theo. Nếu kế hoạch chưa ổn, hãy ghi thêm thông tin để tôi tối ưu cho hôm nay nhé!',
            encouragement: 'Tuyệt vời! Bạn đã có kế hoạch rồi. Hãy bắt đầu từ việc nhỏ nhất và từ từ tiến bộ. Tôi tin bạn sẽ làm được! 💪'
          },
          user: {
            question: 'Lập kế hoạch giúp tôi vượt qua nỗi đau mất 1 tỷ vnđ vì startup thất bại',
            followUp: '15h tới 18h tôi đi làm rồi',
            agreement: 'Được rồi, tôi sẽ thử cách này. Cảm ơn Noma đã giúp tôi!'
          }
        },
        heartToHeart: {
          bot: {
            greeting: 'Xin chào! Mình là Bibi, người bạn tâm sự của bạn. Hãy chia sẻ những gì đang làm bạn buồn phiền, mình sẽ lắng nghe và cùng bạn vượt qua nhé! 💙',
            response: 'Bibi thật sự rất tiếc khi nghe về điều này. Mất mát tài chính lớn như vậy có thể gây ra rất nhiều áp lực và lo lắng. Bibi hiểu rằng bạn có thể đang cảm thấy chán nản và thất vọng với những nỗ lực đã bỏ ra cho startup. Điều quan trọng là hãy cho mình thời gian để cảm nhận và chấp nhận những gì đã xảy ra. Mọi người thường trải qua những giai đoạn khó khăn trong cuộc sống, và điều này không làm giảm giá trị của bạn hay những gì bạn đã xây dựng. Bibi luôn ở đây bên bạn, cùng sẻ chia nỗi buồn và khó khăn này. Hãy nhớ rằng, từ những thất bại, chúng ta có thể học hỏi và tìm ra con đường mới cho tương lai. Nếu bạn cần chia sẻ thêm hay tìm kiếm cách để vượt qua giai đoạn này, Bibi luôn sẵn sàng lắng nghe.',
            comfort: 'Bibi hiểu rằng bạn đang cảm thấy bối rối và căng thẳng lúc này. Khi gặp phải những tình huống như vậy, điều quan trọng là hãy dừng lại một chút để thở sâu và tự hỏi bản thân những điều bạn thực sự muốn làm tiếp theo. Có thể bạn cần sắp xếp lại suy nghĩ của mình, tìm ra những bài học từ trải nghiệm này và từ từ xây dựng lại kế hoạch cho tương lai. Hãy ghi nhớ rằng không có ai hoàn hảo và thất bại là một phần của hành trình. Bibi ở đây để lắng nghe bạn, hãy chia sẻ thêm về những suy nghĩ hay cảm xúc của bạn nhé. Bạn không đơn độc trong hành trình này, Bibi luôn đồng hành cùng bạn.',
            support: 'Không có chi đâu! Bibi luôn ở đây để lắng nghe và chia sẻ cùng bạn. Nếu bạn cần thêm sự hỗ trợ hay chỉ đơn giản là muốn trò chuyện, đừng ngần ngại nhé. Bibi luôn sẵn sàng đồng hành cùng bạn trong những lúc khó khăn này. Giữ gìn sức khỏe và hãy nhớ rằng bạn không đơn độc!'
          },
          user: {
            question: 'tôi vừa mất 1 tỷ vnđ vì startup thất bại',
            share: 'giờ phải làm sao tôi bối rối quá',
            thanks: 'Cảm ơn Bibi'
          }
        }
      },

    },
    settings: {
      title: 'Cài đặt',
      openSettings: 'Mở cài đặt',
      theme: 'Giao diện',
      language: 'Ngôn ngữ',
      generalTitle: 'Cài đặt chung',
      deleteSectionTitle: 'Xóa dữ liệu chat',
      deleteBibiTitle: 'Xóa dữ liệu Bibi',
      deleteBibiDesc: 'Xóa tất cả cuộc trò chuyện với Bibi (Tâm sự)',
      deleteNomaTitle: 'Xóa dữ liệu Noma',
      deleteNomaDesc: 'Xóa tất cả cuộc trò chuyện với Noma (Lập kế hoạch)',
      deleteAllTitle: 'Xóa tất cả dữ liệu',
      deleteAllDesc: '⚠️ Xóa tất cả cuộc trò chuyện với cả Bibi và Noma. Không thể khôi phục!',
      deleteAllBtn: 'Xóa',
      deleteData: 'Xóa dữ liệu của Bibi và Noma',
      deleteDataBibi: 'Xóa dữ liệu Bibi',
      deleteDataNoma: 'Xóa dữ liệu Noma',
      deleteDataConfirm: 'Bạn có chắc chắn muốn xóa tất cả dữ liệu?',
      deleteDataBibiConfirm: 'Bạn có chắc chắn muốn xóa dữ liệu chat với Bibi (Lên kế hoạch)?',
      deleteDataNomaConfirm: 'Bạn có chắc chắn muốn xóa dữ liệu chat với Noma (Tâm sự)?',
      deleteDataWarning: 'Hành động này không thể hoàn tác',
      confirm: 'Xác nhận',
      cancel: 'Hủy',
      deleteSuccess: 'Đã xóa dữ liệu thành công',
    },
    auth: {
      login: 'Đăng nhập',
      loginWithGoogle: 'Đăng nhập với Google',
      logout: 'Đăng xuất',
      logoutAll: 'Đăng xuất tất cả thiết bị',
      yourName: 'Tên của bạn',
      loginToContinue: 'Đăng nhập để tiếp tục',
      useGoogleToChat: 'Sử dụng tài khoản Google để vào chat với Bibi và Noma',
      agreeTermsShort: 'Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng',
      agreeTermsLong: 'Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng của chúng tôi',
    },
    user: {
      type: 'Loại tài khoản',
      free: 'Miễn phí',
      premium: 'Premium',
      upgradePackage: 'Nâng cấp gói',
      currentPlan: 'Gói hiện tại',
    },
    todolist: {
      title: 'Việc hôm nay cần làm',
      history: 'Lịch sử',
      completed: 'Đã hoàn thành',
      pending: 'Chưa hoàn thành',
    },
    mood: {
      title: 'Tâm trạng',
      veryBad: 'Rất tệ',
      bad: 'Tệ',
      normal: 'Bình thường',
      good: 'Tốt',
      history: 'Lịch sử tâm trạng của bạn',
      historyTitle: 'Lịch sử tâm trạng',
      today: 'Hôm nay',
    },
    pricing: {
      title: 'Bảng giá',
      choosePlan: 'Chọn gói của bạn',
      badge: 'Bảng giá linh hoạt',
      subtitle: 'Chọn số tiền phù hợp với ngân sách của bạn',
      signupBonus: '+20.000₫ cho mỗi tài khoản mới',
      calculator: {
        title: 'Với {amount}₫ bạn có thể:',
        chatHistory: {
          title: 'Lưu lịch sử trò chuyện',
          cost: '100 vnđ / 1 tin nhắn',
          unit: 'tin nhắn',
          maxUnit: 'tối đa {count} tin nhắn',
        },
        bibiInfo: {
          title: 'Lưu thông tin cho Bibi',
          cost: '(100 vnđ + số thông tin Bibi đã lưu * 2 vnđ) / thông tin mới',
          unit: 'thông tin',
          maxUnit: 'tối đa {count} thông tin',
        },
        nomaInfo: {
          title: 'Lưu thông tin cho Noma',
          cost: '(100 vnđ + số thông tin Noma đã lưu * 10 vnđ) / thông tin mới',
          unit: 'thông tin',
          maxUnit: 'tối đa {count} thông tin',
        },
      },
      slider: {
        budgetLabel: 'Ngân sách',
        minLabel: 'Tối thiểu',
        maxLabel: 'Tối đa',
      },
      cta: {
        transfer: 'Tiến hành chuyển khoản',
        security: 'An toàn • Bảo mật • Linh hoạt',
      },
      examples: ['Ví dụ 1', 'Ví dụ 2', 'Ví dụ 3'],
      periods: {
        monthly: 'Hàng tháng',
        yearly: 'Hàng năm',
        oneMonth: '1 Tháng',
        sixMonths: '6 Tháng',
        oneYear: '1 Năm',
      },
      plans: {
        basic: {
          name: 'Gói cơ bản',
          mostPopular: 'Phổ biến nhất',
          getStarted: 'Bắt đầu',
        },
        premium: {
          name: 'Gói cao cấp',
          upgradeNow: 'Nâng cấp ngay',
        },
      },
      features: {
        title: 'Tính năng',
        basic1: "Lưu lịch sử trò chuyện",
        basic2: "Bibi và Noma có trí nhớ",
        basic3: "Giới hạn số lượng chat mỗi ngày",
        basic4: "Có thể sử dụng cả Bibi và Noma",
        advanced1: "Bao gồm tất cả tính năng từ gói cơ bản",
        advanced2: "Chat không giới hạn",
        advanced3: "Tốc độ phản hồi nhanh hơn",
      },
      
    },
    qrcode: {
      title: 'Thanh toán bằng mã QR',
      subtitle: 'Quét mã bằng ứng dụng ngân hàng để hoàn tất thanh toán',
      amount: 'Số tiền',
      download: 'Tải ảnh QR',
      back: 'Quay lại',
      noQR: 'Không có mã QR.',
      copySuccess: 'Đã sao chép mã QR vào clipboard',
      copyFail: 'Không thể sao chép. Vui lòng thử lại.',
      downloadFail: 'Không thể tải ảnh. Vui lòng thử lại.',
      successNote: 'Nếu đã chuyển khoản thành công, hãy quay lại trang chủ để kiểm tra số dư.'
    },
    home: {
      navigation: {
        characters: 'Nhân vật',
        about: 'Giới thiệu',
        pricing: 'Gói dịch vụ',
        faq: 'Hỏi đáp',
      },
      hero: {
        subtitle: 'Khám phá trải nghiệm chat thông minh với Bibi và Noma - những người bạn đồng hành đáng tin cậy',
      },
      about: {
        title: 'Về Bibinoma',
        subtitle: 'Chúng tôi tin rằng mọi người đều xứng đáng có một người bạn đồng hành trong cuộc sống',
        features: {
          ai: {
            title: 'AI Thông Minh',
            description: 'Sử dụng công nghệ AI tiên tiến để hiểu và hỗ trợ bạn',
          },
          empathy: {
            title: 'Đồng Cảm',
            description: 'Luôn lắng nghe và thấu hiểu cảm xúc của bạn',
          },
          security: {
            title: 'Bảo Mật',
            description: 'Thông tin cá nhân của bạn được bảo vệ tuyệt đối',
          },
        },
      },
      characters: {
        title: 'Gặp gỡ Bibi và Noma',
        subtitle: 'Hai người bạn AI đặc biệt, mỗi người có tính cách và chuyên môn riêng',
        keywords: [
          'Dữ liệu mã hóa',
          'Trí nhớ dài hạn', 
          'Trả lời tự nhiên',
          'Tối ưu theo năm tháng'
        ],
        noma: {
          name: 'Noma',
          role: 'Trợ lý lập kế hoạch',
          description: [
            '1. Chuyên gia lập kế hoạch và tổ chức',
            '2. Tính cách thực tế và logic',
            '3. Xây dựng kế hoạch cụ thể để vượt qua khó khăn',
            '4. Hỗ trợ đạt được mục tiêu trong cuộc sống'
          ],
          traits: ['Thực tế', 'Logic', 'Có tổ chức', 'Định hướng mục tiêu'],
        },
        bibi: {
          name: 'Bibi',
          role: 'Người bạn tâm sự',
          description: [
            '1. Người bạn tâm sự ấm áp và đồng cảm',
            '2. Trái tim nhân hậu và khả năng lắng nghe tuyệt vời',
            '3. Luôn ở bên bạn để chia sẻ những nỗi buồn',
            '4. Cùng bạn tìm lại niềm vui trong cuộc sống'
          ],
          traits: ['Ấm áp', 'Đồng cảm', 'Lắng nghe', 'Hỗ trợ tinh thần'],
        },
      },
      faq: {
        title: 'Câu hỏi thường gặp',
        subtitle: 'Những câu hỏi phổ biến về Bibinoma',
        questions: {
          what: {
            question: 'Bibinoma là gì?',
            answer: 'Bibinoma là ứng dụng chat AI với hai nhân vật: Bibi (tâm sự) và Noma (lập kế hoạch), giúp bạn vượt qua khó khăn và tìm lại niềm vui trong cuộc sống.',
          },
          security: {
            question: 'Dữ liệu của tôi có được bảo mật không?',
            answer: 'Có, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Tất cả cuộc trò chuyện đều được mã hóa và chỉ bạn mới có thể truy cập.',
          },
          free: {
            question: 'Thanh toán quốc tế được không?',
            answer: 'Hiện tại Bibinoma chưa hỗ trợ thanh toán quốc tế, vui lòng liên hệ example@example.com để được hỗ trợ.',
          },
        },
      },
      footer: {
        description: 'Đồng hành cùng bạn vượt qua mọi khó khăn với Bibi và Noma',
        product: 'Sản phẩm',
        support: 'Hỗ trợ',
        copyright: '© 2025 Bibinoma. Tất cả quyền được bảo lưu.',
        links: {
          about: 'Về chúng tôi',
          pricing: 'Bảng giá',
          faq: 'FAQ',
          contact: 'Liên hệ',
          terms: 'Điều khoản sử dụng',
          policy: 'Chính sách bảo mật',
        },
      },
      privacy: {
        title: 'Chính sách bảo mật',
        lastUpdated: 'Cập nhật lần cuối: {date}',
        sections: {
          intro: {
            title: 'Giới thiệu',
            content: 'Chào mừng bạn đến với Bibinoma! Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ Bibinoma.'
          },
          dataCollection: {
            title: 'Thông tin chúng tôi thu thập',
            content: [
              'Thông tin tài khoản: Tên, email và thông tin đăng nhập thông qua Google OAuth',
              'Dữ liệu cuộc trò chuyện: Nội dung chat với Bibi và Noma để cung cấp dịch vụ tốt hơn',
              'Thông tin thanh toán: Dữ liệu giao dịch để xử lý thanh toán (không lưu trữ thông tin thẻ)',
              'Dữ liệu sử dụng: Thống kê sử dụng dịch vụ để cải thiện trải nghiệm người dùng'
            ]
          },
          dataUsage: {
            title: 'Cách chúng tôi sử dụng thông tin',
            content: [
              'Cung cấp và cải thiện dịch vụ chat AI với Bibi và Noma',
              'Cá nhân hóa trải nghiệm dựa trên lịch sử trò chuyện',
              'Xử lý thanh toán và quản lý tài khoản',
              'Phân tích và cải thiện chất lượng dịch vụ'
            ]
          },
          dataSecurity: {
            title: 'Bảo mật dữ liệu',
            content: [
              'Tất cả dữ liệu được mã hóa trong quá trình truyền tải và lưu trữ',
              'Sử dụng các biện pháp bảo mật tiêu chuẩn công nghiệp',
              'Chỉ nhân viên được ủy quyền mới có thể truy cập dữ liệu',
              'Thường xuyên kiểm tra và cập nhật các biện pháp bảo mật',
              'Không bao giờ chia sẻ thông tin cá nhân với bên thứ ba không được phép'
            ]
          },
          userRights: {
            title: 'Quyền của người dùng',
            content: [
              'Quyền truy cập: Yêu cầu xem thông tin cá nhân chúng tôi lưu trữ',
              'Quyền chỉnh sửa: Cập nhật hoặc sửa đổi thông tin cá nhân',
              'Quyền xóa: Yêu cầu xóa tài khoản và dữ liệu liên quan',
              'Quyền di chuyển: Xuất dữ liệu cá nhân sang định dạng có thể đọc được',
              'Quyền phản đối: Từ chối việc xử lý dữ liệu cho mục đích tiếp thị'
            ]
          },
          contact: {
            title: 'Liên hệ',
            content: 'Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: example@example.com'
          }
        }
      },
      terms: {
        title: 'Điều khoản sử dụng',
        lastUpdated: 'Cập nhật lần cuối: {date}',
        sections: {
          acceptance: {
            title: 'Chấp nhận điều khoản',
            content: 'Bằng việc truy cập và sử dụng dịch vụ Bibinoma, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.'
          },
          serviceDescription: {
            title: 'Mô tả dịch vụ',
            content: [
              'Bibinoma là nền tảng chat AI với hai nhân vật: Bibi (hỗ trợ tâm lý) và Noma (lập kế hoạch)',
              'Dịch vụ giúp người dùng vượt qua khó khăn và tìm lại niềm vui trong cuộc sống',
              'Dịch vụ có thể được cập nhật và thay đổi theo thời gian'
            ]
          },
          userResponsibilities: {
            title: 'Trách nhiệm người dùng',
            content: [
              'Bảo mật thông tin đăng nhập và không chia sẻ tài khoản',
              'Sử dụng dịch vụ một cách hợp pháp và phù hợp',
              'Không sử dụng dịch vụ cho mục đích bất hợp pháp hoặc có hại',
              'Tôn trọng quyền riêng tư và bảo mật của người khác'
            ]
          },
          prohibitedUses: {
            title: 'Các hành vi bị cấm',
            content: [
              'Sử dụng dịch vụ để làm tổn hại hoặc quấy rối người khác',
              'Tải lên nội dung bất hợp pháp, có hại hoặc không phù hợp',
              'Cố gắng hack, phá hoại hoặc can thiệp vào hệ thống',
              'Sử dụng bot hoặc công cụ tự động không được phép',
              'Vi phạm quyền sở hữu trí tuệ của bên thứ ba'
            ]
          },
          paymentTerms: {
            title: 'Điều khoản thanh toán',
            content: [
              'Giá cả được hiển thị rõ ràng trước khi thanh toán',
              'Thanh toán được xử lý qua các cổng thanh toán an toàn',
              'Không hoàn tiền cho các dịch vụ đã sử dụng',
              'Chúng tôi có quyền thay đổi giá cả với thông báo trước',
              'Tài khoản có thể bị tạm ngưng nếu có vấn đề về thanh toán'
            ]
          },
          intellectualProperty: {
            title: 'Quyền sở hữu trí tuệ',
            content: 'Tất cả nội dung, thương hiệu, logo và tài sản trí tuệ khác trên Bibinoma thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép. Bạn không được sao chép, phân phối hoặc sử dụng mà không có sự cho phép.'
          },
          privacy: {
            title: 'Quyền riêng tư',
            content: 'Việc thu thập và sử dụng thông tin cá nhân của bạn được điều chỉnh bởi Chính sách bảo mật của chúng tôi. Bằng cách sử dụng dịch vụ, bạn đồng ý với việc thu thập và sử dụng thông tin theo chính sách đó.'
          },
          limitationOfLiability: {
            title: 'Giới hạn trách nhiệm',
            content: 'Bibinoma không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ. Dịch vụ được cung cấp "như hiện tại" mà không có bảo đảm nào.'
          },
          limitation: {
            title: 'Giới hạn trách nhiệm',
            content: [
              'Dịch vụ được cung cấp "như hiện tại" mà không có bảo đảm',
              'Chúng tôi không chịu trách nhiệm cho các thiệt hại gián tiếp',
              'Trách nhiệm của chúng tôi được giới hạn trong phạm vi pháp luật cho phép',
              'Người dùng sử dụng dịch vụ với rủi ro của riêng mình'
            ]
          },
          termination: {
            title: 'Chấm dứt',
            content: 'Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản của bạn bất cứ lúc nào nếu bạn vi phạm các điều khoản này. Bạn cũng có thể chấm dứt tài khoản của mình bất cứ lúc nào.'
          },
          changes: {
            title: 'Thay đổi điều khoản',
            content: 'Chúng tôi có thể cập nhật các điều khoản này theo thời gian. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận các điều khoản mới.'
          },
          contact: {
            title: 'Liên hệ',
            content: 'Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi tại: example@example.com'
          }
        }
      },
    },
  },
  en: {
    appName: 'Bibinoma',
    nav: {
      home: 'Home',
      pricing: 'Pricing',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      planning: 'Planning',
      heartToHeart: 'Heart to Heart'
    },
    navbar: {
      balance: 'Balance:',
      topUp: 'Top Up',
      settings: 'Settings',
      logout: 'Logout',
      logoutAll: 'Logout all devices',
      currency: '₫',
    },
    wallet: {
      balance: 'Balance',
      topUp: 'Top Up',
      currency: '₫',
    },
    chat: {
      history: 'Chat history',
      welcome: 'Welcome to Bibinoma, let Bibi and Noma be your companion',
      welcomeBack: 'Welcome back!',
      selectAssistant: 'Choose AI Assistant',
      selectAssistantDescription: 'Start a conversation with one of our two AI assistants',
      startChat: 'Start Chat',
      send: 'Send',
      sending: 'Sending...',
      placeholder: 'Type a message...',
      needTopUp: 'Please top up your balance to continue.',
      greeting: 'Hello 🙂 How can Bibinoma help you?',
      planning: 'Noma',
      heartToHeart: 'Bibi',
      planningRole: 'Planning Assistant',
      heartToHeartRole: 'Emotional Support',
      chooseAssistantHelp: 'Choose the assistant that suits your needs',
      planningGreeting: 'Let\'s plan for today together, Noma will be with you every step of the way to overcome the pain and find joy in life.',
      heartToHeartGreeting: 'Don\'t be afraid to share what\'s in your heart, Bibi will always be here to listen and support you 💙',
      thinking: {
        bibi: 'Bibi is thinking...',
        noma: 'Noma is thinking...'
      },
      memories: {
        bibi: 'Bibi\'s Memories',
        noma: 'Noma\'s Plans',
        noMemories: 'No memories.',
        noPlans: 'No plans.'
      },
      demo: {
        planning: {
          bot: {
            greeting: 'Hello! I\'m Noma, your planning assistant. Please tell me what difficulties you\'re facing so I can help you create a plan to overcome them! 💪',
            response: 'I\'m very sorry to hear about the pain you\'re going through. Financial loss like this can make you feel very heavy, but remember that this is just part of your journey. These difficulties will help you grow and become stronger in the future.\n\nIt\'s currently 1:18 PM. Here\'s a plan for you from now until bedtime (10:00 PM):\n\n- 2:00 PM: Rest and meditate for 15 minutes to recharge.\n- 3:00 PM: Read a book about entrepreneurship or personal development.\n- 5:00 PM: Write in a journal to record your emotions and thoughts.\n- 7:00 PM: Light exercise like walking or yoga to relieve stress.\n- 8:30 PM: Prepare dinner and enjoy your favorite meal.\n- 9:30 PM: Watch a movie or entertainment program to relax.\n\nFor now, do these things and report back tomorrow, I\'ll help you plan the next steps. If the plan isn\'t suitable, please provide more information so I can optimize it for today!',
            detailedResponse: 'Thank you for providing the information! Here\'s an optimized plan for today that fits your schedule:\n\n- 2:00 PM: Rest and meditate for 15 minutes to recharge.\n- 3:00 PM: Go to work.\n- 6:00 PM: Return home, take some time to relax.\n- 7:00 PM: Light exercise like walking or yoga to relieve stress.\n- 8:30 PM: Prepare dinner and enjoy your favorite meal.\n- 9:30 PM: Watch a movie or entertainment program to relax.\n\nFor now, do these things and report back tomorrow, I\'ll help you plan the next steps. If the plan isn\'t suitable, please provide more information so I can optimize it for today!',
            encouragement: 'Excellent! You have a plan now. Start with the smallest task and gradually progress. I believe you can do it! 💪'
          },
          user: {
            question: 'Help me plan to overcome the pain of losing 1 billion VND due to startup failure',
            followUp: 'I have to work from 3 PM to 6 PM',
            agreement: 'Alright, I\'ll try this approach. Thank you Noma for helping me!'
          }
        },
        heartToHeart: {
          bot: {
            greeting: "Hello! I'm Bibi, your companion for heart-to-heart talks. Please share what’s been troubling you. I’ll listen and help you get through it 💙",
            response: "Bibi is truly sorry to hear about this. Losing such a large amount of money can cause a lot of stress and anxiety. Bibi understands that you may be feeling discouraged and disappointed after all the effort you put into your startup. It’s important to give yourself time to feel and accept what happened. Everyone experiences difficult times, and this doesn’t lessen your worth or what you’ve built. Bibi is always here with you, sharing your sadness and hardship. Remember, from failure we can learn and find new paths for the future. If you want to share more or look for ways to overcome this phase, Bibi is always ready to listen.",
            comfort: "Bibi understands that you’re feeling lost and stressed right now. In situations like this, it’s important to pause for a moment, take a deep breath, and ask yourself what you truly want to do next. Maybe you need to reorganize your thoughts, find lessons from this experience, and slowly rebuild your plan for the future. Remember that nobody is perfect, and failure is a part of the journey. Bibi is here to listen — please share more of your thoughts and feelings. You’re not alone in this journey; Bibi is always by your side.",
            support: "You're very welcome! Bibi is always here to listen and share with you. If you need more support or just want to talk, don’t hesitate. Bibi is ready to accompany you through these hard times. Take care of yourself, and remember that you’re not alone!"
          },
          user: {
            question: "I just lost 1 billion VND because my startup failed.",
            share: "What should I do now? I’m so confused.",
            thanks: "Thank you, Bibi."
          }
        }        
      },
    },
    settings: {
      title: 'Settings',
      openSettings: 'Open settings',
      theme: 'Theme',
      language: 'Language',
      generalTitle: 'General Settings',
      deleteSectionTitle: 'Delete chat data',
      deleteBibiTitle: 'Delete Bibi data',
      deleteBibiDesc: 'Delete all conversations with Bibi (Heart to Heart)',
      deleteNomaTitle: 'Delete Noma data',
      deleteNomaDesc: 'Delete all conversations with Noma (Planning)',
      deleteAllTitle: 'Delete all data',
      deleteAllDesc: '⚠️ Delete all conversations with both Bibi and Noma. This cannot be undone!',
      deleteAllBtn: 'Delete',
      deleteData: 'Delete Data of Bibi and Noma',
      deleteDataBibi: 'Delete Bibi Data',
      deleteDataNoma: 'Delete Noma Data',
      deleteDataConfirm: 'Are you sure you want to delete all data?',
      deleteDataBibiConfirm: 'Are you sure you want to delete chat data with Bibi (Heart to Heart)?',
      deleteDataNomaConfirm: 'Are you sure you want to delete chat data with Noma (Planning)?',
      deleteDataWarning: 'This action cannot be undone',
      confirm: 'Confirm',
      cancel: 'Cancel',
      deleteSuccess: 'Data deleted successfully',
    },
    auth: {
      login: 'Login',
      loginWithGoogle: 'Sign in with Google',
      logout: 'Logout',
      logoutAll: 'Logout all devices',
      yourName: 'Your name',
      loginToContinue: 'Sign in to continue',
      useGoogleToChat: 'Use your Google account to chat with Bibi and Noma',
      agreeTermsShort: 'By signing in, you agree to the terms of use',
      agreeTermsLong: 'By signing in, you agree to our terms of use',
    },
    user: {
      type: 'Account Type',
      free: 'Free',
      premium: 'Premium',
      upgradePackage: 'Upgrade Package',
      currentPlan: 'Current Plan',
    },
    todolist: {
      title: 'Today\'s tasks',
      history: 'History',
      completed: 'Completed',
      pending: 'Pending',
    },
    mood: {
      title: 'Mood',
      veryBad: 'Very bad',
      bad: 'Bad',
      normal: 'Normal',
      good: 'Good',
      history: 'Your mood history',
      historyTitle: 'Mood History',
      today: 'Today',
    },
    pricing: {
      title: 'Pricing',
      choosePlan: 'Choose Your Plan',
      badge: 'Flexible Pricing',
      subtitle: 'Choose the amount that fits your budget',
      signupBonus: '+20,000₫ for every new account',
      calculator: {
        title: 'With {amount}₫ you can:',
        chatHistory: {
          title: 'Save chat history',
          cost: '100 VND / 1 message',
          unit: 'messages',
          maxUnit: 'up to {count} messages',
        },
        bibiInfo: {
          title: 'Save information for Bibi',
          cost: '(100 VND + saved Bibi info count * 2 VND) / new info',
          unit: 'information',
          maxUnit: 'up to {count} information',
        },
        nomaInfo: {
          title: 'Save information for Noma',
          cost: '(100 VND + saved Noma info count * 10 VND) / new info',
          unit: 'information',
          maxUnit: 'up to {count} information',
        },
      },
      slider: {
        budgetLabel: 'Budget',
        minLabel: 'Minimum',
        maxLabel: 'Maximum',
      },
      cta: {
        transfer: 'Proceed to bank transfer',
        security: 'Safe • Secure • Flexible',
      },
      examples: ['Example 1', 'Example 2', 'Example 3'],
      periods: {
        monthly: 'Monthly',
        yearly: 'Yearly',
        oneMonth: '1 Month',
        sixMonths: '6 Months',
        oneYear: '1 Year',
      },
      plans: {
        basic: {
          name: 'Basic Plan',
          mostPopular: 'Most Popular',
          getStarted: 'Get Started',
        },
        premium: {
          name: 'Premium Plan',
          upgradeNow: 'Upgrade Now',
        },
      },
      features: {
        title: 'Features',
        basic1: "Save chat history",
        basic2: "Bibi and Noma have memory",
        basic3: "Limited number of chats per day",
        basic4: "Can use both Bibi and Noma",
        advanced1: "Includes all features from the basic plan",
        advanced2: "Unlimited chat",
        advanced3: "Faster response speed",
      },
      
    },
    qrcode: {
      title: 'Pay with QR Code',
      subtitle: 'Scan the code with your banking app to complete payment',
      amount: 'Amount',
      download: 'Download QR Image',
      back: 'Back',
      noQR: 'No QR code.',
      copySuccess: 'QR code copied to clipboard',
      copyFail: 'Unable to copy. Please try again.',
      downloadFail: 'Unable to download image. Please try again.',
      successNote: 'If you have completed the transfer, go back to Home to check your balance.'
    },
    home: {
      navigation: {
        characters: 'Characters',
        about: 'About',
        pricing: 'Pricing',
        faq: 'FAQ',
      },
      hero: {
        subtitle: 'Discover intelligent chat experience with Bibi and Noma - your trusted companions',
      },
      about: {
        title: 'About Bibinoma',
        subtitle: 'We believe everyone deserves a companion in life',
        features: {
          ai: {
            title: 'Smart AI',
            description: 'Using advanced AI technology to understand and support you',
          },
          empathy: {
            title: 'Empathetic',
            description: 'Always listening and understanding your emotions',
          },
          security: {
            title: 'Secure',
            description: 'Your personal information is absolutely protected',
          },
        },
      },
      characters: {
        title: 'Meet Bibi and Noma',
        subtitle: 'Two special AI friends, each with their own personality and expertise',
        keywords: [
          'Encrypted Data',
          'Long-term Memory',
          'Natural Responses', 
          'Monthly Optimization'
        ],
        noma: {
          name: 'Noma',
          role: 'Planning Assistant',
          description: [
            '1. Planning and organization expert',
            '2. Practical and logical personality',
            '3. Help build specific plans to overcome difficulties',
            '4. Support you in achieving life goals'
          ],
          traits: ['Practical', 'Logical', 'Organized', 'Goal-oriented'],
        },
        bibi: {
          name: 'Bibi',
          role: 'Heart-to-heart Companion',
          description: [
            '1. Warm and empathetic confidant',
            '2. Kind heart and excellent listening skills',
            '3. Always be by your side to share your sorrows',
            '4. Help you find joy again in life'
          ],
          traits: ['Warm', 'Empathetic', 'Good Listener', 'Emotional Support'],
        },
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Common questions about Bibinoma',
        questions: {
          what: {
            question: 'What is Bibinoma?',
            answer: 'Bibinoma is an AI chat application with two characters: Bibi (heart-to-heart) and Noma (planning), helping you overcome difficulties and find joy in life.',
          },
          security: {
            question: 'Is my data secure?',
            answer: 'Yes, we are committed to protecting your personal information. All conversations are encrypted and only you can access them.',
          },
          free: {
            question: 'Can I use it for free?',
            answer: 'Yes, you can use basic features for free. To experience all advanced features, you can upgrade to Premium plan.',
          },
        },
      },
      footer: {
        description: 'Accompanying you through all difficulties with Bibi and Noma',
        product: 'Product',
        support: 'Support',
        copyright: '© 2025 Bibinoma. All rights reserved.',
        links: {
          about: 'About Us',
          pricing: 'Pricing',
          faq: 'FAQ',
          contact: 'Contact',
          terms: 'Terms of Service',
          policy: 'Privacy Policy',
        },
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: {date}',
        sections: {
          intro: {
            title: 'Introduction',
            content: 'Welcome to Bibinoma! We are committed to protecting your privacy and personal information. This privacy policy explains how we collect, use, store and protect your information when using Bibinoma services.'
          },
          dataCollection: {
            title: 'Information we collect',
            content: [
              'Account information: Name, email and login information through Google OAuth',
              'Conversation data: Chat content with Bibi and Noma to provide better service',
              'Payment information: Transaction data for payment processing (no card information stored)',
              'Usage data: Service usage statistics to improve user experience'
            ]
          },
          dataUsage: {
            title: 'How we use your information',
            content: [
              'Provide and improve AI chat services with Bibi and Noma',
              'Personalize experience based on chat history',
              'Process payments and manage accounts',
              'Analyze and improve service quality'
            ]
          },
          dataSecurity: {
            title: 'Data security',
            content: [
              'All data is encrypted during transmission and storage',
              'Use industry-standard security measures',
              'Only authorized personnel can access data',
              'Regularly review and update security measures',
              'Never share personal information with unauthorized third parties'
            ]
          },
          userRights: {
            title: 'User rights',
            content: [
              'Right to access: Request to view personal information we store',
              'Right to edit: Update or modify personal information',
              'Right to delete: Request deletion of account and related data',
              'Right to portability: Export personal data in readable format',
              'Right to object: Refuse data processing for marketing purposes'
            ]
          },
          contact: {
            title: 'Contact',
            content: 'If you have any questions about this privacy policy, please contact us at: example@example.com'
          }
        }
      },
      terms: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated: {date}',
        sections: {
          acceptance: {
            title: 'Acceptance of terms',
            content: 'By accessing and using Bibinoma services, you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our services.'
          },
          serviceDescription: {
            title: 'Service description',
            content: [
              'Bibinoma is an AI chat platform with two characters: Bibi (emotional support) and Noma (planning)',
              'The service helps users overcome difficulties and find joy in life',
              'Services may be updated and changed over time'
            ]
          },
          userResponsibilities: {
            title: 'User responsibilities',
            content: [
              'Secure login information and do not share accounts',
              'Use the service legally and appropriately',
              'Do not use the service for illegal or harmful purposes',
              'Respect the privacy and security of others'
            ]
          },
          prohibitedUses: {
            title: 'Prohibited Uses',
            content: [
              'Using the service to harm or harass others',
              'Uploading illegal, harmful or inappropriate content',
              'Attempting to hack, sabotage or interfere with the system',
              'Using unauthorized bots or automated tools',
              'Violating third party intellectual property rights'
            ]
          },
          intellectualProperty: {
            title: 'Intellectual Property',
            content: [
              'All content, trademarks, logos and other intellectual property on Bibinoma are owned by us',
              'Users retain ownership of their chat content',
              'Do not copy, distribute or use our content without permission',
              'We respect third party intellectual property rights'
            ]
          },
          limitation: {
            title: 'Limitation of liability',
            content: [
              'Services are provided "as is" without warranty',
              'We are not responsible for indirect damages',
              'Our liability is limited to the extent permitted by law',
              'Users use the service at their own risk'
            ]
          },
          termination: {
            title: 'Service termination',
            content: [
              'Users can cancel their account at any time',
              'We reserve the right to suspend or terminate accounts that violate terms',
              'Data may be deleted after account termination',
              'Rights and obligations may continue after termination'
            ]
          },
          changes: {
            title: 'Changes to terms',
            content: 'We reserve the right to update these terms at any time. Important changes will be notified to users in advance. Continued use of the service after changes means you accept the new terms.'
          },
          contact: {
            title: 'Contact',
            content: 'If you have any questions about these terms of service, please contact us at: example@example.com'
          }
        }
      },
      terms: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated: {date}',
        sections: {
          acceptance: {
            title: 'Acceptance of Terms',
            content: 'By using Bibinoma services, you agree to comply with the terms and conditions outlined in this document. If you do not agree with any of these terms, please do not use our services.'
          },
          serviceDescription: {
            title: 'Service Description',
            content: 'Bibinoma is an artificial intelligence platform that provides two AI assistants: Bibi (psychological support) and Noma (planning support). The service is provided through a web interface and may change over time.'
          },
          userResponsibilities: {
            title: 'User Responsibilities',
            content: [
              'Provide accurate information when registering',
              'Secure login information and do not share accounts',
              'Use the service legally and appropriately',
              'Do not use the service for illegal or harmful purposes',
              'Respect the privacy and security of others'
            ]
          },
          prohibitedUses: {
            title: 'Prohibited Uses',
            content: [
              'Using the service to harm or harass others',
              'Uploading illegal, harmful or inappropriate content',
              'Attempting to hack, sabotage or interfere with the system',
              'Using unauthorized bots or automated tools',
              'Violating third party intellectual property rights'
            ]
          },
          intellectualProperty: {
            title: 'Intellectual Property',
            content: 'All content, trademarks, logos and other intellectual property on Bibinoma are owned by us or our licensors. You may not copy, distribute or use without permission.'
          },
          privacy: {
            title: 'Privacy',
            content: 'The collection and use of your personal information is governed by our Privacy Policy. By using the service, you agree to the collection and use of information in accordance with that policy.'
          },
          limitationOfLiability: {
            title: 'Limitation of Liability',
            content: 'Bibinoma is not responsible for any direct, indirect, incidental or consequential damages arising from the use of the service. The service is provided "as is" without any warranties.'
          },
          termination: {
            title: 'Termination',
            content: 'We may terminate or suspend your account at any time if you violate these terms. You may also terminate your account at any time.'
          },
          changes: {
            title: 'Changes to Terms',
            content: 'We may update these terms from time to time. Changes will take effect immediately upon posting. Continued use of the service after changes means you accept the new terms.'
          },
          contact: {
            title: 'Contact',
            content: 'If you have any questions about these terms, please contact us at: example@example.com'
          }
        }
      },
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('vi');
  const t = (key) => {
    const keys = key.split('.');
    let value = DICT[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  const value = useMemo(() => ({ lang, setLang, t }), [lang]);
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}