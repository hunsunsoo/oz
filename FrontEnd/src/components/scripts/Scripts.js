import React, { useState } from "react";

//인트로 대화 스크립트 데이터
const IntrodialogueData = [
  // 인트로 일러스트
  {
    index: 1,
    character: "",
    message:
      "산책 중이던 도로시는 갑작스러운 토네이도에, \
      오즈의 나라로 날아가게 되는데...",
  },
  {
    index: 2,
    character: "",
    message:
      "집으로 돌아가기 위해선 위대한 마법사를 만나야한다는 이야기를 들었고",
  },
  {
    index: 3,
    character: "",
    message: "도로시는 길을 헤매다 누군가를 만나게 된다..",
  },
  // 2.
  {
    index: 4,
    character: "도로시",
    message: "허수아비야, 거기서 가만히 뭐 하고 있니?",
  },

  {
    index: 5,
    character: "허수아비",
    message:
      "난 스스로 생각을 하지 못하는 허수아비야. 마법사 오즈가 소원을 이루어 준다고 해서 오즈를 찾아가는 길이야! 근데 어디로 가야 할지 모르겠어… 이게 뭐야 미로잖아? 분위기를 보니 함정도 있을 것 같아 무서워..",
  },

  {
    index: 6,
    character: "도로시",
    message: "그렇구나. 나도 오즈에게 가는 길인데 함께 가지 않을래?",
  },

  {
    index: 7,
    character: "허수아비",
    message: "그래 좋아! 고마워",
  },
  // 3
  {
    index: 8,
    character: "도로시",
    message:
      "좋아! (어 근데 저기 쭈그려있는 사자는 뭐지??) 엇 .. 사자야 여기서 뭐하고있니?? 우리는 오즈에게 소원을 이뤄달라고 하기 위해 가고있어!",
  },

  {
    index: 9,
    character: "도로시",
    message:
      "나... 나 말이야??나는 용기가 없어.. 아무것도 할 수 없어..오즈가 나에게 용기도 줄 수 있을까?",
  },

  {
    index: 10,
    character: "도로시",
    message: "물론이지",
  },

  {
    index: 11,
    character: "사자",
    message:
      "그렇다면, 너희들이 괜찮다면, 나도 함께 가고 싶어. 조그만 용기도 없는 내 삶은 정말 견딜 수 없어",
  },
  //4
  {
    index: 12,
    character: "도로시",
    message: "좋아!근데 저기 아까부터 나무만 베고있는 저 깡통은 뭘까?",
  },

  {
    index: 13,
    character: "양철 나무꾼",
    message:
      "난 마녀의 저주로 마음를 잃어버렸어.. 난 인간시절 내 심장을 찾고싶어.. 오즈가 나에게도 심장을 줄 수 있을까?",
  },
  {
    index: 14,
    character: "도로시",
    message:
      "물론 그럴 수 있다고 생각해. 허수아비에게 뇌를 주는 것만큼 쉬운 일일거야. 같이가자!",
  },
  //5
  {
    index: 15,
    character: "",
    message: "도로시와 친구들을 모험을 떠나 오즈를 만나게 되는데..",
  },
  {
    index: 16,
    character: "",
    message:
      "위대한 마법사 오즈는 서쪽 마녀를 물리치고 오면 소원을 들어주겠다고 약속한다.",
  },
  {
    index: 17,
    character: "",
    message: "도로시와 친구들은 소원을 이루기 위해 다시 모험을 떠나게 된다.",
  },
];
const dialogueData = [
  // 1. 사칙연산
  {
    index: 1,
    character: "도로시",
    message: "앗 앞에 길이 막혀있어 근데 저 숫자판은 뭐지?",
  },
  {
    index: 2,
    character: "사자",
    message:
      "뭔가 여기 숫자를 집어넣으면 지나갈 수 있는 문이 열릴 것 같은데...",
  },
  {
    index: 3,
    character: "허수아비",
    message: "(아무 생각이 없는 허수아비가 숫자판에 손을 댄다)",
  },

  {
    index: 4,
    character: "허수아비",
    message: "나 이제 뭔가 깨달았어",
  },
  // 2.

  {
    index: 5,
    character: "도로시",
    message:
      "앗 이게 뭐야 미로잖아? 분위기를 보니 함정도 있을 것 같아 무서워..",
  },

  {
    index: 6,
    character: "양철 나무꾼",
    message: "여길 어떻게 지나가야 하는거지?? 어어..? 사자야 조심해",
  },

  {
    index: 7,
    character: "사자",
    message: "으아아앗",
  },

  {
    index: 8,
    character: "사자",
    message:
      "후.. 빠져나왔다... 나 이제 뭐든 할 수 있을 것 같아!!!!  얘들아 이제 곧 마녀의 성이야 서두르자 !!!!",
  },
  // 3
  {
    index: 9,
    character: "도로시",
    message: "거의 다온 것 같아",
  },

  {
    index: 10,
    character: "양철 나무꾼",
    message: "…..쿵",
  },

  {
    index: 11,
    character: "나무꾼",
    message:
      ".. 너희가 나를 구해준거니 ? 정말 고마워 너희의 따뜻한 마음에 감동받았어 우리 어서 마녀를 잡으러가자!!!",
  },
  //4
  {
    index: 12,
    character: "도로시",
    message: "여기가 마녀의 성이야!!!",
  },

  {
    index: 13,
    character: "모두",
    message:
      "우리 다함께 힘을 합쳐서 마녀를 무찌르자!!!  자 우리의 협동심을 보여줘 볼까 ????",
  },

  // Add more dialogueData as needed
];
//인트로 대화 스크립트 데이터
const OutrodialogueData = [
  // 인트로 일러스트
  {
    index: 1,
    character: "도로시",
    message: "우리가 해냈어 !!!!!!",
  },
  {
    index: 2,
    character: "사자",
    message: "얼른 돌아가서 오즈에게 소원을 이뤄달라고 하자~",
  },
  {
    index: 3,
    character: "허수아비",
    message: "그래 ! 근데 우리 이미 소원을 이룬 것 같지 않아?",
  },
  // 2.
  {
    index: 4,
    character: "양철 나무꾼",
    message: "맞아. 나도 너희 덕에 이미 따뜻한 마음이 생긴 것 같아",
  },

  {
    index: 5,
    character: "도로시",
    message: "맞아맞아~! 사자도 용기가 생겼고 허수아비도 똑똑해졌어~!",
  },

  {
    index: 6,
    character: "사자",
    message: "하지만 도로시는 집으로 어떻게 돌아가야 하는걸까?",
  },

  {
    index: 7,
    character: "허수아비",
    message: "오즈에게 돌아가서 물어보자~!",
  },
  // 3
  {
    index: 8,
    character: "도로시",
    message: "잠시 후...",
  },

  {
    index: 9,
    character: "모두",
    message: "도로시야 잘가~!",
  },

  {
    index: 10,
    character: "도로시",
    message: "얘들아 고마워 안녕!~!!",
  },

  {
    index: 11,
    character: "",
    message: "서쪽 마녀를 물리친 도로시와 친구들은",
  },
  //4
  {
    index: 12,
    character: "",
    message: "모험을 하며 지혜, 용기, 따뜻한 마음을 얻었고",
  },

  {
    index: 13,
    character: "",
    message: "친구들과 다음을 기약하며 집으로 돌아가게 되었습니다.",
  },
];

export { IntrodialogueData, dialogueData, OutrodialogueData };
