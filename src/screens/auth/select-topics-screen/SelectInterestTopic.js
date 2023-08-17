import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {Theme} from '../../../styles/theme';
import {PADDING_HOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../styles/constant';
import {CommonStyle} from '../../../styles';
import TopNavHeader from '../../../components/top-nav-header';
import {navigation} from '../../../routes/navigation';
import {setApiLoading} from '../../../redux/actions/config';
import {ADD_CATEGORY_PREFERENCES, GET_CATEGORIES} from '../../../utils/Query';
import MainButton from '../../../components/main-button';
import {useLazyQuery, useMutation} from '@apollo/client';
import OnboardCardList from './OnboardCardList';

const SelectInterestTopicScreen = () => {
    const dispatch = useDispatch();
    const [interestData, setInterestData] = useState([]);
    const [categoryIds, setCategoryIds] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [apiLoading, setLoading] = useState(false);
    const [getTopicData, {data: categoriesData, loading, error}] = useLazyQuery(GET_CATEGORIES);

    const [addCategory, {data: addCategories}] = useMutation(ADD_CATEGORY_PREFERENCES, {
      variables: {
        'categories': categoryIds,
      },
    });

    useEffect(() => {
      setLoading(loading);
    }, [loading]);

    useEffect(() => {
      getTopicData();
    }, []);

    useEffect(() => {
      if (apiLoading) {
        return;
      }
      const categories = categoriesData?.categories ? categoriesData?.categories : [];
      let newCategories = [];
      Array.isArray(categories) && categories.map((item, key) => {
        newCategories.push({
          id: item?.id,
          src: item?.image?.cloudinaryData?.secure_url,
          title: item?.name,
          checked: false,
        });
      });
      setInterestData(newCategories);

    }, [categoriesData, apiLoading]);

    useEffect(() => {
      if (Array.isArray(categoryIds)) {
        dispatch(setApiLoading(true));
        addCategory()
          .then(res => {
            dispatch(setApiLoading(false));
            navigation.navigate('SelectFollowPeople');

          })
          .catch(error => {
            dispatch(setApiLoading(false));
            console.log(error);
          });
      }
    }, [categoryIds]);

    const onPressLeft = () => {
      navigation.goBack();
    };

    const onPressNext = () => {
      addCategoryPreferences();
    };

    const addCategoryPreferences = () => {
      let categoryIds = [];
      interestData.map((item, index) => {
        if (item.checked) {
          categoryIds.push(item?.id);
        }
      });
      setCategoryIds(categoryIds);
    };

    const onRefresh = () => {
      getTopicData();
    };

    const onPressItem = (selItem, index) => {
      let newProducts = [];
      if (index === 'interest') {
        interestData.map(item => {
          if (item?.id === selItem?.id) {
            newProducts.push({
              ...item,
              checked: !selItem?.checked,
            });
          } else {
            newProducts.push(item);
          }
        });
        setInterestData(newProducts);
      }
    };

    const HeaderLayout = () => {
      let title = 'Select the topics that\ninterest you';
      return (
        <View style={styles.headerContainer}>
          <Text style={[CommonStyle.text26_inter_m, {textAlign: 'center', lineHeight: 26}]}>
            {title}
          </Text>
        </View>
      );
    };

    const TopicsLayout = () => {
      return (
        <View style={{
          flex: 1,
          width: WINDOW_WIDTH,
          paddingHorizontal: PADDING_HOR,
          marginTop: 30,
          backgroundColor: Theme.white,
        }}>
          <OnboardCardList
            data={interestData}
            onPressItem={onPressItem}
            type={'interest'}
            onEndReached={() => {
            }}
            isCloseToBottom={() => {
            }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} translucent={true} backgroundColor={'transparent'}/>

        <TopNavHeader onPressLeft={onPressLeft} leftIcon={Theme.arrow_left} title={'Customize feed theme'}/>

        {HeaderLayout()}

        {TopicsLayout()}

        <View style={styles.btnContainer}>
          <MainButton
            title={'Next'}
            isValid={true}
            onPress={onPressNext}
          />
        </View>

      </View>
    );
  }
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.white,
  },
  headerContainer: {
    paddingTop: WINDOW_HEIGHT * 0.02,
    paddingHorizontal: PADDING_HOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    backgroundColor: Theme.white,
    marginTop: 50,
  },
  btnContainer: {
    width: WINDOW_WIDTH,
    paddingHorizontal: PADDING_HOR,
    alignSelf: 'center',
    marginTop: 13,
    marginBottom: 30,
  },
});

export default SelectInterestTopicScreen;
