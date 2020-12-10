import { All_TreesQuery } from "@internalTypes/generated/graphql";

export const data: All_TreesQuery = {
  allDecisionTrees: {
    edges: [
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Test",
          id: "45679569",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"red"}, {"name":"Draft","color":"green"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Test2",
          id: "5348765867",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}, {"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Hello world",
          id: "34563458765",
          createdAt: "2020-11-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Unfertig","color":"red"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"blue"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Whatever",
          id: "6597859678",
          createdAt: "2020-11-11T12:50:51+0000",
          tags: "",
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "The nicest one",
          id: "2365438756",
          createdAt: "2005-12-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}, {"name":"Unfertig","color":"red"},{"name":"Uncreative","color":"blue"},{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Another Tree????",
          id: "345763567",
          createdAt: "2020-11-03T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"red"}, {"name":"Draft","color":"indigo"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"blue"},{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "So many trees :(",
          id: "80-77890",
          createdAt: "2015-01-19T12:50:51+0000",
          tags:
            '[ {"name":"Unfertig","color":"red"}, {"name":"Draft","color":"indigo"}, {"name":"Uncreative","color":"blue"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Quark",
          id: "45748678",
          createdAt: "2000-11-11T12:50:51+0000",
          tags: '[{"name":"Another","color":"purple"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Butter",
          id: "567957689",
          createdAt: "2018-09-20T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Draft","color":"indigo"}, {"name":"System","color":"pink"},{"name":"Uncreative","color":"blue"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Haus",
          id: "5346754678",
          createdAt: "2020-10-11T12:50:51+0000",
          tags:
            '[{"name":"Archiv","color":"yellow"}, {"name":"Fehlerhaft","color":"red"}]',
        },
      },
      {
        node: {
          __typename: "DecisionTreeNode",
          name: "Supermarkt",
          id: "142351456",
          createdAt: "2010-11-11T12:50:51+0000",
          tags:
            '[{"name":"Unfertig","color":"red"}, {"name":"Draft","color":"indigo"},{"name":"Uncreative","color":"blue"},{"name":"Another","color":"purple"}]',
        },
      },
    ],
  },
};
