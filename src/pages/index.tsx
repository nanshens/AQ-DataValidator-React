import yayJpg from '../assets/yay.jpg';
import {Button, Col, Input, List, Row, Typography} from "antd";
import styles from './index.less';
const { Title } = Typography;

export default function IndexPage() {
    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];
  return (
      <div className={styles.index}>
          <Row >
              <Col span={8} className={styles.left}>
                  <Input placeholder="Basic usage" />
                  <List
                      header={<div>Header</div>}
                      footer={<div>Footer</div>}
                      bordered
                      dataSource={data}
                      renderItem={(item) => (
                          <List.Item>
                              <Typography.Text mark>[ITEM]</Typography.Text> {item}
                          </List.Item>
                      )}
                  />
              </Col>
              <Col span={16} className={styles.right}>
                  <Row>
                      <Title>AQ 数据校验系统</Title>
                  </Row>
                  <Row>
                      <Button type="dashed">添加校验器</Button>
                  </Row>

              </Col>
          </Row>
      </div>
  );
}
