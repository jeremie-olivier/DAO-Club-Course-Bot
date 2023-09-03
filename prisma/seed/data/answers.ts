export const answsers: any = [
  {
    questionId: 1,
    lessonId: 1,
    order: "A",
    text: `Red Road Cruiser`,
    isTheCorrectAnswer: false,
  },
  {
    questionId: 1,
    lessonId: 1,
    order: "B",
    text: `Remote Procedure Call`,
    isTheCorrectAnswer: true,
  },
  {
    questionId: 1,
    lessonId: 1,
    order: "C",
    text: `River Point Control`,
    isTheCorrectAnswer: false,
  },

  {
    questionId: 2,
    lessonId: 1,
    order: "A",
    text: `April 1999`,
    isTheCorrectAnswer: false,
  },
  {
    questionId: 2,
    lessonId: 1,
    order: "B",
    text: `January 2009`,
    isTheCorrectAnswer: true,
  },
  {
    questionId: 2,
    lessonId: 1,
    order: "C",
    text: `February 2012`,
    isTheCorrectAnswer: false,
  },

  {
    questionId: 3,
    lessonId: 1,
    order: "A",
    text: `ERC-20`,
    isTheCorrectAnswer: true,
  },
  {
    questionId: 3,
    lessonId: 1,
    order: "B",
    text: `ERC-271`,
    isTheCorrectAnswer: false,
  },
  {
    questionId: 3,
    lessonId: 1,
    order: "C",
    text: `ERC-115`,
    isTheCorrectAnswer: false,
  },
];

export default answsers;

//   id                 Int      @id @default(autoincrement())
//   text               String
//   question           Question @relation(fields: [questionId], references: [id])
//   questionId         Int
//   users              User[]
//   course             Course   @relation(fields: [courseId], references: [id])
//   courseId           Int
//   isTheCorrectAnswer Boolean
