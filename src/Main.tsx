import React, {useState} from 'react';
import {
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DeleteSVG from './svg/DeleteSVG';
import AddSvg from './svg/AddSvg';

type TaskType = {
    key: string
    title: string
    isDone: boolean
}

const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export const Main = () => {

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const [tasks, setTasks] = useState<TaskType[]>([
        {
            key: '1', title: 'HTML', isDone: true
        }, {
            key: '2', title: 'React', isDone: true
        }, {
            key: '3', title: 'React Native', isDone: false
        }
    ])
    const [title, setTitle] = useState('')

    const render: ListRenderItem<TaskType> = ({item}) => {
        return <View>
            <TouchableOpacity
                style={[styles.item, {opacity: item.isDone ? 0.2 : 1}]}
                onLongPress={() => removeTask(item.key)}
                onPress={() => updateTask(item.key)}
            >
                <>
                    <Text
                        style={[styles.title, {textDecorationLine: item.isDone ? 'line-through' : 'none'}]}>{item.title}</Text>
                    <Text>{item.isDone ? 'true' : 'false'}</Text>
                    <DeleteSVG onPress={() => removeTask(item.key)}
                               style={styles.deleteSvg}/>
                </>
            </TouchableOpacity>
        </View>
    }

    const addTask = () => {
        const newTask: TaskType = {
            key: `${title}${tasks.length + 1}`,
            title: title,
            isDone: false,
        }
        setTasks([newTask, ...tasks])
        setTitle('')
    };

    const removeTask = (key: string) => {
        setTasks(tasks.filter((el) => {
            return el.key !== key
        }))
    }

    const updateTask = (key: string) => {
        setTasks(tasks.map((el) => el.key === key ? {...el, isDone: !el.isDone} : el))
    }

    return (
        <View>
            <View style={styles.header}>
                <TextInput value={title} onChangeText={setTitle} style={styles.input}/>
                <TouchableOpacity onPress={addTask}>
                    <AddSvg/>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                renderItem={render}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    deleteSvg: {
        position: 'absolute',
        bottom: -6,
        right: 0
    },
    item: {
        backgroundColor: 'pink',
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        letterSpacing: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        width: 330,
        height: 30,
        borderWidth: 1,
        borderRadius: 5
    }
})